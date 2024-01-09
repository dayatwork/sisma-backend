import { Role } from "@prisma/client";
import ShortUniqueId from "short-unique-id";

import prisma from "../../lib/prisma";
import { generateVerificationToken } from "../../lib/tokens";
import { sendPasswordEmail, sendVerificationEmail } from "../../lib/mail";
import { comparePassword, hashPassword } from "../../lib/password";
import { getVerificationTokenByToken } from "../auth/auth.service";

// ========================
// ======= QUERIES ========
// ========================
export async function getUsers(where?: {
  organizationId?: string | null;
  isActive?: boolean;
  role?: Role;
}) {
  const users = await prisma.user.findMany({
    where: where,
  });
  return users;
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
}

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
}

// ==========================
// ======= MUTATIONS ========
// ==========================
interface RegisterOrganizationUserInput {
  email: string;
  name: string;
  role: Role;
  organizationId: string;
  verifyImmediately?: boolean;
}

export async function registerOrganizationUser({
  email,
  name,
  organizationId,
  role,
  verifyImmediately = false,
}: RegisterOrganizationUserInput) {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      organizationId,
      role,
      isActive: false,
      verifiedAt: verifyImmediately ? new Date() : null,
    },
  });
  if (!verifyImmediately) {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
  }
  return user;
}

export async function verifyUser({ token }: { token: string }) {
  const verificationToken = await getVerificationTokenByToken(token);
  if (
    !verificationToken ||
    verificationToken.expires.getTime() < new Date().getTime()
  ) {
    throw new Error("Invalid token or expired token");
  }
  const uid = new ShortUniqueId({ length: 10 });
  const password = uid.rnd();
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.update({
    where: { email: verificationToken.email },
    data: { isActive: true, verifiedAt: new Date(), password: hashedPassword },
  });

  await sendPasswordEmail(user.email, password);

  return user;
}

export async function changePassword({
  id,
  newPassword,
  oldPassword,
}: {
  id: string;
  oldPassword: string;
  newPassword: string;
}) {
  let user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.password) {
    throw new Error("Password not set");
  }

  const passwordMatch = await comparePassword(oldPassword, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid old password");
  }

  const newHashedPassword = await hashPassword(newPassword);

  user = await prisma.user.update({
    where: { id },
    data: { password: newHashedPassword },
  });

  return user;
}

interface UpdateUserInput {
  id: string;
  name?: string;
  photo?: string;
}

export async function updateUser({ id, name, photo }: UpdateUserInput) {
  const user = await prisma.user.update({
    where: { id },
    data: { name, photo },
  });
  return user;
}

export async function deactivateUser(id: string) {
  const user = await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });
  return user;
}

export async function activateUser(id: string) {
  const user = await prisma.user.update({
    where: { id },
    data: { isActive: true },
  });
  return user;
}

export async function deleteUser(id: string) {
  const user = await prisma.user.delete({ where: { id } });
  return user;
}
