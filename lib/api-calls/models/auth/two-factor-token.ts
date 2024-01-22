"use server";

import { db } from "@/lib/database";
import { TwoFactorTokenType } from "@/types";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: {
        token,
      },
    });

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: {
        email,
      },
    });

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const deleteTwoFactorTokenById = async (id: string) => {
  try {
    return await db.twoFactorToken.delete({ where: { id } });
  } catch (error) {
    return false;
  }
};

export const createTwoFactorToken = async ({
  email,
  expires,
  token,
}: TwoFactorTokenType) => {
  try {
    return await db.twoFactorToken.create({
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
