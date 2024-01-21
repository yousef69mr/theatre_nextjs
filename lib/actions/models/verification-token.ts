"use server";

import { db } from "@/lib/database";
import { VerificationTokenType } from "@/types";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        token,
      },
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email,
      },
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const deleteVerificationTokenById = async (id: string) => {
  try {
    return await db.verificationToken.delete({ where: { id } });
  } catch (error) {
    return false;
  }
};

export const createVerificationToken = async ({
  email,
  expires,
  token,
}: VerificationTokenType) => {
  try {
    return await db.verificationToken.create({
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
