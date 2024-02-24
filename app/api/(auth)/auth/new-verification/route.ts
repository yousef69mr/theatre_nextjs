import { getUserByEmail } from "@/lib/actions/models/user";
import { getVerificationTokenByToken } from "@/lib/actions/models/verification-token";
import { db } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Token is missing!" }, { status: 400 });
  }

  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return NextResponse.json(
      { error: "Token doesn't exist!" },
      { status: 404 }
    );
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return NextResponse.json({ error: "Token has expired!" }, { status: 403 });
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return NextResponse.json(
      { error: "Email doesn't exist!" },
      { status: 404 }
    );
  }
  try {
    await db.user.update({
      where: { id: existingUser.id },
      data: { emailVerified: new Date(), email: existingToken.email },
    });

    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return NextResponse.json({ success: "Email verified!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
