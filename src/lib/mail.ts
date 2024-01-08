import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.APP_URL}/auth/new-verification?=token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href=${confirmLink}>here</a> to confirm email.</p>`,
  });
}

export async function sendPasswordEmail(email: string, password: string) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Account password",
    html: `<p>Your account password is ${password}. Immediately change your password after successfully logging in!</p>`,
  });
}
