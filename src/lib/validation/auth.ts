import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string({ required_error: "Full name is required" })
      .min(1, "Full name is required"),
    company: z
      .string({ required_error: "Company name is required" })
      .min(1, "Company name is required"),
    email: z
      .string({ required_error: "Work email is required" })
      .email("Please enter a valid work email"),
    phone: z
      .string({ required_error: "Phone number is required" })
      .min(6, "Please enter a valid phone number"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string({
      required_error: "Please confirm your password",
    }),
    terms: z.boolean().refine((val) => val, {
      message: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterPayload = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export type LoginPayload = z.infer<typeof loginSchema>;
