import { getPasswordResetTokenByToken } from "@/lib/actions/models/password-reset-token";
import { getUserByEmail } from "@/lib/actions/models/user";
import { newPasswordSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/database";

export async function POST(request: NextRequest) {
  const { token, ...rest } = await request.json();
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = newPasswordSchema.safeParse(rest);

  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" },{status:400});
   
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
}
