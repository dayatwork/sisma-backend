import { OrganizationType } from "@prisma/client";
import prisma from "../../lib/prisma";
import { CreateOrganizationInput } from "./organization.schema";
import ShortUniqueId from "short-unique-id";

// ========================
// ======= QUERIES ========
// ========================
export async function getOrganizations(params?: { search?: string }) {
  const organizations = await prisma.organization.findMany({
    where: params?.search
      ? {
          OR: [
            { code: { contains: params.search, mode: "insensitive" } },
            { name: { contains: params.search, mode: "insensitive" } },
          ],
        }
      : undefined,
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
  const uid = new ShortUniqueId({ length: 8 });
  const organization = await prisma.organization.create({
    data: { code: uid.rnd(), ...input },
  });
  return organization;
}
