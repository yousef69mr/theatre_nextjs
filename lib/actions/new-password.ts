"use server";

import { newPasswordSchema } from "@/lib/validations";
import { getPasswordResetTokenByToken } from "@/lib/actions/models/password-reset-token";
import { getUserByEmail } from "@/lib/actions/models/user";
import bcrypt from "bcryptjs";
import { db } from "../database";

export const newPassword = async (
  values: Zod.infer<typeof newPasswordSchema>,
  token: string
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = newPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email doesn't exist!" };
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    return { success: "Password updated!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
