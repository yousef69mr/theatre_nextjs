"use server";

import { resetSchema } from "@/lib/validations/index";
import { getUserByEmail } from "./models/user";
import { sendPasswordResetEmail } from "../mail";
import { generatePasswordResetToken } from "../tokens";

export const reset = async (values: Zod.infer<typeof resetSchema>) => {
  const validatedFields = resetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordRestToken = await generatePasswordResetToken(email);

  if (!passwordRestToken) {
    return { error: "Password reset token not created" };
  }

  try {
    await sendPasswordResetEmail(
      passwordRestToken.email,
      passwordRestToken.token
    );

    return { success: "Reset email sent!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
