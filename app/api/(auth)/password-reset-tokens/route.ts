import { db } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const tokens = await db.passwordResetToken.findMany();

    return NextResponse.json(tokens, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 404 });
  }
}

export async function POST(request: NextRequest) {
  const { email, expires, token } = await request.json();

  try {
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!expires) {
      return NextResponse.json(
        { error: "expires is required" },
        { status: 400 }
      );
    }
    if (!token) {
      return NextResponse.json({ error: "token is required" }, { status: 400 });
    }

    const passwordResetToken = await db.passwordResetToken.create({
      data: {
        email,
        expires,
        token,
      },
    });
    // console.log(passwordResetToken);
    return NextResponse.json(passwordResetToken, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
