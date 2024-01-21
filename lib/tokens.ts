import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import {
  createVerificationToken,
  deleteVerificationTokenById,
  getVerificationTokenByEmail,
} from "@/lib/actions/models/verification-token";
import {
  deletePasswordResetTokenById,
  getPasswordResetTokenByEmail,
  createPasswordResetToken,
} from "@/lib/actions/models/password-reset-token";
import {
  createTwoFactorToken,
  deleteTwoFactorTokenById,
  getTwoFactorTokenByEmail,
} from "./actions/models/two-factor-token";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await deleteVerificationTokenById(existingToken.id);
  }

  const verificationToken = await createVerificationToken({
    token,
    email,
    expires,
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await deletePasswordResetTokenById(existingToken.id);
  }

  const passwordRestToken = await createPasswordResetToken({
    token,
    email,
    expires,
  });

  return passwordRestToken;
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  // expires after 5 minutes
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await deleteTwoFactorTokenById(existingToken.id);
  }

  const twoFactorToken = await createTwoFactorToken({
    token,
    email,
    expires,
  });

  return twoFactorToken;
};
