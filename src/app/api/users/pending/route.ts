import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const users = await User.find({ status: "pending" }).sort({ createdAt: -1 });

        return NextResponse.json(users);
    } catch (error) {
        console.error("[pending_users_get]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
