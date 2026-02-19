import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Params is a promise in Next.js 15+
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { role, companyId } = body;

        // Validate
        if (!role || !["user", "admin", "staff"].includes(role)) {
            return NextResponse.json({ message: "Invalid role" }, { status: 400 });
        }

        await dbConnect();

        const updateData: any = {
            status: "approved",
            role,
        };

        if (companyId) {
            updateData.companyId = companyId;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[approve_user_put]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
