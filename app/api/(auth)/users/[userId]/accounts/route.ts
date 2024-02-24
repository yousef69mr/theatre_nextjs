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
    const accounts = await db.account.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: UserProps) {
  const {
    params: { userId },
  } = props;

  if (!userId) {
    return NextResponse.json({ error: "userId is missing!" }, { status: 400 });
  }

  try {
    const accounts = await db.account.deleteMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(accounts, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
