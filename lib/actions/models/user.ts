"use server";

import { db } from "@/lib/database";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      include: {
        actor: true,
        executor: true,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

export const deleteUserById = async (id: string) => {
  try {
    await db.user.delete({
      where: {
        id,
      },
    });

    return { success: "Deleted successfully!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
