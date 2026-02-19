import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const firstError =
        Object.values(errors)
          .flat()
          .filter(Boolean)
          .shift() ?? "Invalid form submission.";

      return NextResponse.json(
        { message: firstError },
        { status: 400 },
      );
    }

    const { fullName, company, email, phone, password } = parsed.data;

    await dbConnect();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        {
          message:
            existingUser.status === "pending"
              ? "We've already received an access request for this email."
              : "This email is already registered. Try logging in instead.",
        },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: fullName.trim(),
      company: company.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      password: hashedPassword,
      role: "user",
      status: "pending",
    });

    return NextResponse.json(
      { message: "Your access request has been submitted." },
      { status: 201 },
    );
  } catch (error) {
    console.error("[register-error]", error);
    return NextResponse.json(
      { message: "Unable to submit your request. Please try again shortly." },
      { status: 500 },
    );
  }
}
