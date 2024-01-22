import { getPasswordResetTokenByToken } from "@/lib/actions/models/password-reset-token";
import { getUserByEmail } from "@/lib/actions/models/user";
import { newPasswordSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/database";

export async function POST(request: NextRequest) {
  const { token, ...rest } = await request.json();
  if (!token) {
    return  NextResponse.json({ error: "Missing token!" },{status:400});
  }

  const validatedFields = newPasswordSchema.safeParse(rest);

  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" },{status:400});
   
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return  NextResponse.json({ error: "Invalid token!" },{status:400});
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return  NextResponse.json({ error: "Token has expired!" },{status:400});
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return  NextResponse.json({ error: "Email doesn't exist!" },{status:404});
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

    return  NextResponse.json({ success: "Password updated!" },{status:200});
  } catch (error) {
    return  NextResponse.json({ error: "Something went wrong!" },{status:500});
  }
}
