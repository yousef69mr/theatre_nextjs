"use server"

import { settingsSchema } from "@/lib/validations";
import { currentUser } from "@/lib/auth";
import { getUserByEmail, getUserById } from "./models/user";
import { db } from "@/lib/database";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const settings = async (values: Zod.infer<typeof settingsSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    if (!verificationToken) {
      return { error: "Verification token can't be created!" };
    }
    try {
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );
    } catch (error) {
      return { error: "Verification token can't be sent!" };
    }
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  try {
    await db.user.update({
      where: {
        id: dbUser.id,
      },
      data: {
        ...values,
      },
    });

    return { success: "Updated successfully" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
