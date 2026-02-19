import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Company from "@/models/Company";
import { auth } from "@/auth";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session) { // protect route
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("query");

        let filter = {};
        if (query) {
            filter = { name: { $regex: query, $options: "i" } };
        }

        const companies = await Company.find(filter).sort({ name: 1 }).lean();

        return NextResponse.json(companies);
    } catch (error) {
        console.error("[companies_get]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        // In a real app, check for admin role here
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        await dbConnect();

        // Basic validation (can enhance with Zod later)
        if (!body.name) {
            return NextResponse.json({ message: "Company name is required" }, { status: 400 });
        }

        const existing = await Company.findOne({ name: { $regex: new RegExp(`^${body.name}$`, "i") } });
        if (existing) {
            return NextResponse.json({ message: "Company already exists" }, { status: 409 });
        }

        const company = await Company.create(body);

        return NextResponse.json(company, { status: 201 });

    } catch (error) {
        console.error("[companies_post]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
