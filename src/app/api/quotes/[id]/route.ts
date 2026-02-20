import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Quote from "@/models/Quote";
import { deriveQuoteTotals, isQuoteEditable } from "@/lib/quotes";

function buildLookup(id: string) {
  if (isValidObjectId(id)) {
    return { $or: [{ _id: id }, { quoteId: id }] } as Record<string, unknown>;
  }
  return { quoteId: id };
}

function ownsQuote(quote: any, userId: string) {
  const ownerId = typeof quote.user === "string" ? quote.user : quote.user?.toString();
  return ownerId === userId;
}

function normaliseItems(items: any[] | undefined, fallback: any[]) {
  if (!Array.isArray(items)) {
    return fallback;
  }
  return items.map((item) => ({
    productType: item.productType,
    configuration: item.configuration,
    priceBreakdown: item.priceBreakdown,
    quantity: item.quantity ?? 1,
    location: item.location,
    netPrice: item.netPrice ?? item.totalPrice,
    totalPrice: item.totalPrice ?? item.netPrice ?? item.priceBreakdown?.total ?? 0,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const query = buildLookup(resolvedParams.id);
    const quote = await Quote.findOne(query).lean();

    if (!quote) {
      return NextResponse.json({ message: "Quote not found" }, { status: 404 });
    }

    if (!ownsQuote(quote, session.user.id) && session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error("[quote_get]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const quote = await Quote.findOne(buildLookup(resolvedParams.id));
    if (!quote) {
      return NextResponse.json({ message: "Quote not found" }, { status: 404 });
    }

    if (!ownsQuote(quote, session.user.id) && session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (!isQuoteEditable(quote.status)) {
      return NextResponse.json(
        { message: "Quote can no longer be updated" },
        { status: 409 },
      );
    }

    const body = await request.json();
    const updatedItems = normaliseItems(body.items, quote.items || []);

    if (body.customerDetails) {
      quote.customerDetails = { ...quote.customerDetails, ...body.customerDetails };
    }

    if (body.companyId) {
      quote.company = body.companyId;
    }

    if (Array.isArray(body.items)) {
      quote.items = updatedItems;
    }

    if (body.productType || updatedItems.length) {
      quote.productType = body.productType ?? updatedItems[0]?.productType ?? quote.productType;
    }

    if (body.configuration || updatedItems.length) {
      quote.configuration = body.configuration ?? updatedItems[0]?.configuration ?? quote.configuration;
    }

    if (body.priceBreakdown || updatedItems.length) {
      quote.priceBreakdown = body.priceBreakdown ?? updatedItems[0]?.priceBreakdown ?? quote.priceBreakdown;
    }

    if (body.quantity || updatedItems.length) {
      quote.quantity = body.quantity ?? updatedItems[0]?.quantity ?? quote.quantity;
    }

    if (Object.prototype.hasOwnProperty.call(body, "location")) {
      quote.location = body.location ?? quote.location;
    } else if (updatedItems.length && !quote.location) {
      quote.location = updatedItems[0]?.location;
    }

    if (Object.prototype.hasOwnProperty.call(body, "netPrice") || updatedItems.length) {
      quote.netPrice = body.netPrice ?? updatedItems[0]?.netPrice ?? quote.netPrice;
    }

    if (Object.prototype.hasOwnProperty.call(body, "totalPrice") || updatedItems.length) {
      quote.totalPrice = body.totalPrice ?? updatedItems[0]?.totalPrice ?? quote.totalPrice;
    }

    if (body.financials) {
      quote.financials = { ...quote.financials, ...body.financials };
    }

    if (body.expiryDate !== undefined) {
      quote.expiryDate = body.expiryDate ? new Date(body.expiryDate) : undefined;
    }

    if (body.status) {
      quote.status = body.status;
    }

    const totals = deriveQuoteTotals({ ...body, items: quote.items });
    quote.netTotal = totals.netTotal;
    quote.taxTotal = totals.taxTotal;
    quote.grossTotal = totals.grossTotal;

    await quote.save();

    return NextResponse.json(quote);
  } catch (error) {
    console.error("[quote_put]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const quote = await Quote.findOne(buildLookup(resolvedParams.id));
    if (!quote) {
      return NextResponse.json({ message: "Quote not found" }, { status: 404 });
    }

    if (!ownsQuote(quote, session.user.id) && session.user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get("hard") === "true";

    if (hardDelete) {
      if (session.user.role !== "admin") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      await quote.deleteOne();
      return NextResponse.json({ success: true });
    }

    quote.status = "archived";
    quote.archivedAt = new Date();
    await quote.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[quote_delete]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
