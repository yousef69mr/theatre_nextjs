import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.PUBLIC_DOMAIN}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "FCAI-Theatre@resend.dev",
    to: email,
    subject: "confirm email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.PUBLIC_DOMAIN}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "FCAI-Theatre@resend.dev",
    to: email,
    subject: "Reset password email",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password</p>`,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "FCAI-Theatre@resend.dev",
    to: email,
    subject: "2FA code",
    html: `<p>Your 2FA code is <strong>${token}</strong></p>`,
  });
};
