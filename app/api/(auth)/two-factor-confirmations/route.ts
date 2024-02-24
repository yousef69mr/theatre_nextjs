import { db } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const tokens = await db.twoFactorConfirmation.findMany();

    return NextResponse.json(tokens, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 404 });
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  try {
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }


    const twoFactorConfirmation = await db.twoFactorConfirmation.create({
      data: {
        userId
      },
    });

    return NextResponse.json(twoFactorConfirmation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
