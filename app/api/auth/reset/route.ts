import { getUserByEmail } from "@/lib/actions/models/user";

import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { resetSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const values = await request.json();

  const validatedFields = resetSchema.safeParse(values);

  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return NextResponse.json({ error: "Email not found!" }, { status: 404 });
  }

  const passwordRestToken = await generatePasswordResetToken(email);

  if (!passwordRestToken) {
    return NextResponse.json(
      { error: "Password reset token not created" },
      { status: 400 }
    );
  }

  try {
    await sendPasswordResetEmail(
      passwordRestToken.email,
      passwordRestToken.token
    );

    return NextResponse.json({ success: "Reset email sent!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
