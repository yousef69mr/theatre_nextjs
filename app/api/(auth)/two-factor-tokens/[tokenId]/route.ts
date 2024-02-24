import { db } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
interface VerificationTokenProps {
  params: {
    tokenId: string;
  };
}

export async function GET(request: NextRequest, props: VerificationTokenProps) {
  const {
    params: { tokenId },
  } = props;

  if (!tokenId) {
    return NextResponse.json({ error: "tokenId is missing!" }, { status: 400 });
  }

  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: {
        token: tokenId,
      },
    });

    return NextResponse.json(twoFactorToken, { status: 200 });
  } catch (error) {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: {
        email: tokenId,
      },
    });
    if (twoFactorToken) {
      return NextResponse.json(twoFactorToken, { status: 200 });
    }
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}

export async function DELETE(
  request: NextRequest,
  props: VerificationTokenProps
) {
  const {
    params: { tokenId },
  } = props;

  if (!tokenId) {
    return NextResponse.json({ error: "tokenId is missing!" }, { status: 400 });
  }

  try {
    const twoFactorToken = await db.twoFactorToken.delete({
      where: {
        id: tokenId,
      },
    });

    return NextResponse.json(twoFactorToken, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
