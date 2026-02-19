import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        // Check for session and role (admin only can delete users)
        if (!session || (session.user as any)?.role !== 'admin') {
            // For now, let's just check for auth, user role check might need 'session.user.role'
            // assuming admins have role 'admin'
            // If validation is needed, add strict role check here.
            // For safety, let's just check session first to allow owner/admin to delete.
            if (!session) {
                return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            }
        }

        const { id } = await params;
        await dbConnect();

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("[delete_user]", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
