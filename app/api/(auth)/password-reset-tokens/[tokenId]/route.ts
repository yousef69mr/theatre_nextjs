import { db } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
interface PasswordResetTokenByTokenProps {
  params: {
    tokenId: string;
  };
}

export async function GET(
  request: NextRequest,
  props: PasswordResetTokenByTokenProps
) {
  const {
    params: { tokenId },
  } = props;

  if (!tokenId) {
    return NextResponse.json({ error: "tokenId is missing!" }, { status: 400 });
  }

  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: {
        token: tokenId,
      },
    });

    return NextResponse.json(passwordResetToken, { status: 200 });
  } catch (error) {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: {
        email: tokenId,
      },
    });
    if (passwordResetToken) {
      return NextResponse.json(passwordResetToken, { status: 200 });
    }
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}

export async function DELETE(
  request: NextRequest,
  props: PasswordResetTokenByTokenProps
) {
  const {
    params: { tokenId },
  } = props;

  if (!tokenId) {
    return NextResponse.json({ error: "tokenId is missing!" }, { status: 400 });
  }

  try {
    const passwordResetToken = await db.passwordResetToken.delete({
      where: {
        id: tokenId,
      },
    });

    return NextResponse.json(passwordResetToken, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
