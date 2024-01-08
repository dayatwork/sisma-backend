import ShortUniqueId from "short-unique-id";

import { getVerificationTokenByEmail } from "../modules/auth/auth.service";
import prisma from "./prisma";

export const generateVerificationToken = async (email: string) => {
  const uid = new ShortUniqueId({ length: 10 });
  const token = uid.rnd();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await prisma.verificationToken.delete({ where: { id: existingToken.id } });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: { email, token, expires },
  });

  return verificationToken;
};
