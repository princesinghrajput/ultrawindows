import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Quote from "@/models/Quote";
import { generateNextQuoteId, deriveQuoteTotals } from "@/lib/quotes";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const requestedUser = searchParams.get("user");

    const filter: Record<string, unknown> = {};
    if (session.user.role === "admin" && requestedUser) {
      filter.user = requestedUser;
    } else {
      filter.user = session.user.id;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { quoteId: { $regex: search, $options: "i" } },
        { "customerDetails.name": { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const quotes = await Quote.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("[quotes_get]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const hasSingleConfig = Boolean(body.configuration);
    const hasItems = Array.isArray(body.items) && body.items.length > 0;
    if (!hasSingleConfig && !hasItems) {
      return NextResponse.json(
        { message: "Configuration or quote items are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const quoteId = await generateNextQuoteId();
    const items = hasItems
      ? body.items.map((item: any) => ({
          productType: item.productType,
          configuration: item.configuration,
          priceBreakdown: item.priceBreakdown,
          quantity: item.quantity ?? 1,
          location: item.location,
          netPrice: item.netPrice ?? item.totalPrice,
          totalPrice:
            item.totalPrice ?? item.netPrice ?? item.priceBreakdown?.total ?? 0,
        }))
      : [
          {
            productType: body.productType,
            configuration: body.configuration,
            priceBreakdown: body.priceBreakdown,
            quantity: body.quantity ?? 1,
            location: body.location,
            netPrice: body.netPrice ?? body.totalPrice ?? body.priceBreakdown?.total,
            totalPrice:
              body.totalPrice ?? body.netPrice ?? body.priceBreakdown?.total ?? 0,
          },
        ];

    const totals = deriveQuoteTotals({ ...body, items });

    const quote = await Quote.create({
      quoteId,
      user: session.user.id,
      customerDetails: body.customerDetails,
      company: body.companyId,
      productType: body.productType ?? items[0]?.productType,
      configuration: body.configuration ?? items[0]?.configuration,
      priceBreakdown: body.priceBreakdown ?? items[0]?.priceBreakdown,
      quantity: body.quantity ?? items[0]?.quantity ?? 1,
      location: body.location ?? items[0]?.location,
      netPrice: body.netPrice ?? items[0]?.netPrice,
      totalPrice: body.totalPrice ?? items[0]?.totalPrice,
      items,
      financials: body.financials,
      netTotal: totals.netTotal,
      taxTotal: totals.taxTotal,
      grossTotal: totals.grossTotal,
      status: body.status ?? "draft",
      expiryDate: body.expiryDate,
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error("[quotes_post]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
