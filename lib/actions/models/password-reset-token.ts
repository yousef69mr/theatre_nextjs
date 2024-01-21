"use server";

import { db } from "@/lib/database";
import { PasswordRestTokenType } from "@/types";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordRestToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    });

    return passwordRestToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordRestToken = await db.passwordResetToken.findFirst({
      where: {
        email,
      },
    });

    return passwordRestToken;
  } catch (error) {
    return null;
  }
};

export const deletePasswordResetTokenById = async (id: string) => {
  try {
    return await db.passwordResetToken.delete({ where: { id } });
  } catch (error) {
    return false;
  }
};

export const createPasswordResetToken = async ({
  email,
  expires,
  token,
}: PasswordRestTokenType) => {
  try {
    return await db.passwordResetToken.create({
      data: {
        email,
        expires,
        token,
      },
    });
  } catch (error) {
    return null;
  }
};
