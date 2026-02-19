import { NextResponse } from "next/server";

import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { message: "You must be signed in to check your status." },
      { status: 401 },
    );
  }

  await dbConnect();
  const user = await User.findOne({ email: session.user.email })
    .select("status updatedAt")
    .lean();

  if (!user) {
    return NextResponse.json(
      { message: "Account could not be found." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    status: user.status,
    updatedAt: user.updatedAt,
  });
}
