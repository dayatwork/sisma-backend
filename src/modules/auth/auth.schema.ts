import { Role } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address"),
    password: z.string({ required_error: "Password is required" }),
  }),
});

export type LoginInput = z.TypeOf<typeof loginSchema>["body"];

export const signupSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address"),
    password: z.string({ required_error: "Password is required" }),
    role: z.nativeEnum(Role),
  }),
});

export type SignupInput = z.TypeOf<typeof signupSchema>["body"];
