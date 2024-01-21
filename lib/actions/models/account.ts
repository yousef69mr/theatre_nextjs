import { db } from "@/lib/database";

export const getAccountsByUserId = async (userId: string) => {
  try {
    const accounts = await db.account.findMany({
      where: {
        userId,
      },
    });
    return accounts;
  } catch (error) {
    return [];
  }
};

export const deleteAccountsByUserId = async (userId: string) => {
  try {
    return await db.account.deleteMany({
      where: {
        userId,
      },
    });

  } catch (error) {
    return null;
  }
};
