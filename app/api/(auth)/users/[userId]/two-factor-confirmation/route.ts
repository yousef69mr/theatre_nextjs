import { db } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
interface UserProps {
  params: {
    userId: string;
  };
}
export async function GET(request: NextRequest, props: UserProps) {
  const {
    params: { userId },
  } = props;

  if (!userId) {
    return NextResponse.json({ error: "userId is missing!" }, { status: 400 });
  }

  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: {
        userId,
      },
    });

    return NextResponse.json(twoFactorConfirmation, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
