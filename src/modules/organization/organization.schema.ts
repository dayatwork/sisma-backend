import { OrganizationType, Role } from "@prisma/client";
import { z } from "zod";

export const createOrganizationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    type: z.nativeEnum(OrganizationType),
    logo: z.string(),
    province: z.string(),
    city: z.string(),
    district: z.string(),
    subdistrict: z.string(),
  }),
});

export type CreateOrganizationInput = z.TypeOf<
  typeof createOrganizationSchema
>["body"];
