import { OrganizationType } from "@prisma/client";
import prisma from "../../lib/prisma";
import { CreateOrganizationInput } from "./organization.schema";

// ========================
// ======= QUERIES ========
// ========================
export async function getOrganizations(where?: {
  types?: OrganizationType[];
  province?: string;
  city?: string;
}) {
  const organizations = await prisma.organization.findMany({
    where: where,
  });
  return organizations;
}

export async function getOrganizationById(id: string) {
  const organization = await prisma.organization.findUnique({ where: { id } });
  return organization;
}

// ==========================
// ======= MUTATIONS ========
// ==========================
export async function createOrganization(input: CreateOrganizationInput) {
  const organization = await prisma.organization.create({ data: input });
  return organization;
}
