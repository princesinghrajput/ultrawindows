import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import { loginSchema } from "@/lib/validation/auth";
import {
  InvalidCredentialsError,
  PendingApprovalError,
  RejectedAccountError,
} from "@/lib/auth/errors";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/portal/login",
    error: "/portal/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new InvalidCredentialsError(
            parsed.error.errors[0]?.message ?? "Invalid email or password.",
          );
        }

        const { email, password } = parsed.data;
        await dbConnect();
        const user = await User.findOne({ email: email.toLowerCase() }).lean();

        if (!user?.password) {
          throw new InvalidCredentialsError();
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
          throw new InvalidCredentialsError();
        }

        if (user.status === "pending") {
          throw new PendingApprovalError();
        }

        if (user.status === "rejected") {
          throw new RejectedAccountError();
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.status = (user as any).status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string) ?? "user";
        session.user.status = (token.status as string) ?? "pending";
      }
      return session;
    },
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const publicPaths = [
        "/portal",
        "/portal/login",
        "/portal/register",
        "/portal/pending",
        "/portal/reset-password",
      ];

      if (publicPaths.some((path) => pathname.startsWith(path))) {
        return true;
      }

      if (pathname.startsWith("/portal")) {
        return Boolean(auth?.user) && auth.user.status === "approved";
      }

      return true;
    },
  },
};
