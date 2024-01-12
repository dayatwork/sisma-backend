import { OrganizationType } from "@prisma/client";
import { z } from "zod";

export const createOrganizationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    type: z.nativeEnum(OrganizationType),
    logo: z.string().optional(),
    province: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    subdistrict: z.string().optional(),
  }),
});

export type CreateOrganizationInput = z.TypeOf<
  typeof createOrganizationSchema
>["body"];

export const getOrganizationsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
  }),
});

export type GetOrganizationsQuery = z.TypeOf<
  typeof getOrganizationsSchema
>["query"];
