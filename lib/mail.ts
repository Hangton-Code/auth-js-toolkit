import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@hangton.me",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${
    process.env.NEXT_PUBLIC_APP_URL as string
  }/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@hangton.me",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to verify your email</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${
    process.env.NEXT_PUBLIC_APP_URL as string
  }/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@hangton.me",
    to: email,
    subject: "Set your password",
    html: `<p>Click <a href="${confirmLink}">here</a> to set/reset/change your password.</p>`,
  });
};
