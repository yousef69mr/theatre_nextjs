import { NextRequest, NextResponse } from "next/server";

import { DEFAULT_LOGIN_REDIRCT } from "@/routes";
import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validations";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/lib/actions/models/user";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import {
  deleteTwoFactorTokenById,
  getTwoFactorTokenByEmail,
} from "@/lib/actions/models/two-factor-token";
import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmationById,
  getTwoFactorConfirmationByUserId,
} from "@/lib/actions/models/two-factor-confirmation";

export async function POST(request: NextRequest) {
  const values = await request.json();

  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return NextResponse.json(
      { error: "Email doesn't exist!" },
      { status: 404 }
    );
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Verification token not created" },
        { status: 400 }
      );
    }
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return NextResponse.json(
      { success: "Confirmation email sent to your mail!" },
      { status: 200 }
    );
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return NextResponse.json({ error: "Invalid code!" }, { status: 400 });
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return NextResponse.json(
          { error: "Code expired! Please try again." },
          { status: 400 }
        );
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
        return NextResponse.json(
          { error: "2FA token not created" },
          { status: 400 }
        );
      }
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return NextResponse.json({ twoFactor: true }, { status: 200 });
    }
  }
  
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRCT,
    });

    return NextResponse.json(
      { success: "logged successfully!" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return NextResponse.json(
            { error: "Invalid credintinals" },
            { status: 400 }
          );
        default:
          return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
          );
      }
    }

    return NextResponse.json({ error: "Internal error" }, { status: 500 });
    // throw error;
  }
}
