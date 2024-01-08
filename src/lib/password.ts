import bcrypt from "bcryptjs";

export async function hashPassword(
  password: string,
  salt: string | number = 10
) {
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(password, hashedPassword);
}
