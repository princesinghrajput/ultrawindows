import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: "user" | "admin";
      status: "pending" | "approved" | "rejected";
    };
  }

  interface User {
    role: "user" | "admin";
    status: "pending" | "approved" | "rejected";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "user" | "admin";
    status?: "pending" | "approved" | "rejected";
  }
}
