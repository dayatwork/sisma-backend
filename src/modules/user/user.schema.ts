import { Role } from "@prisma/client";
import { z } from "zod";

export const registerOrganizationUserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address"),
    organizationId: z.string({ required_error: "OrganizationId is required" }),
    role: z.nativeEnum(Role).default("ORGANIZATION_USER"),
  }),
});

export type RegisterOrganizationUserInput = z.TypeOf<
  typeof registerOrganizationUserSchema
>["body"];
