import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Company from "@/models/Company";
import { auth } from "@/auth";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        // Assuming only admins or staff with permission can edit customers
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        await dbConnect();

        const updatedCompany = await Company.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedCompany) {
            return NextResponse.json({ message: "Company not found" }, { status: 404 });
        }

        return NextResponse.json(updatedCompany);
    } catch (error) {
        console.error("[company_update]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) { // Add stricter role check if needed
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await dbConnect();

        const deletedCompany = await Company.findByIdAndDelete(id);

        if (!deletedCompany) {
            return NextResponse.json({ message: "Company not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Company deleted successfully" });
    } catch (error) {
        console.error("[company_delete]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
