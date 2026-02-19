import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required"),
    email: z
      .string()
      .email("Please enter a valid work email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
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
    .string()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});


export type LoginPayload = z.infer<typeof loginSchema>;
