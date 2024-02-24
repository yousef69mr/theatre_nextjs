"use server";

import { DEFAULT_LOGIN_REDIRCT } from "@/routes";
import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validations/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "./models/user";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import {
  deleteTwoFactorTokenById,
  getTwoFactorTokenByEmail,
} from "./models/two-factor-token";
import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmationById,
  getTwoFactorConfirmationByUserId,
} from "./models/two-factor-confirmation";

export const login = async (values: Zod.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email doesn't exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    if (!verificationToken) {
      return { error: "Verification token not created" };
    }
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent to your mail!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired! Please try again." };
      }

      await deleteTwoFactorTokenById(twoFactorToken.id);

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await deleteTwoFactorConfirmationById(existingConfirmation.id);
      }

      await createTwoFactorConfirmation({ userId: existingUser.id });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      if (!twoFactorToken) {
        return { error: "2FA token not created" };
      }
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRCT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credintinals" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
  //   return { success: "Email sent!" };
};
