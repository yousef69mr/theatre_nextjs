"use server";

import { db } from "@/lib/database";
import { TwoFactorConfirmationType } from "@/types";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: {
        userId,
      },
    });

    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};

export const deleteTwoFactorConfirmationById = async (id: string) => {
  try {
    return await db.twoFactorConfirmation.delete({ where: { id } });
  } catch (error) {
    return false;
  }
};

export const createTwoFactorConfirmation = async ({
  userId,
}: TwoFactorConfirmationType) => {
  try {
    return await db.twoFactorConfirmation.create({
      data: {
        userId,
      },
    });
  } catch (error) {
    return null;
  }
};
