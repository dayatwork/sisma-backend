import ShortUniqueId from "short-unique-id";
import jwt from "jsonwebtoken";

import { getVerificationTokenByEmail } from "../modules/auth/auth.service";
import prisma from "./prisma";
import { AccessTokenPayload } from "../middlewares/auth";

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

export const generateAccessToken = (payload: AccessTokenPayload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!);
  return accessToken;
};
