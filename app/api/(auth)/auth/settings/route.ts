import { getUserByEmail, getUserById } from "@/lib/actions/models/user";
import { currentUser, isAdmin } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/database";

export async function POST(request: NextRequest) {
  const values = await request.json();

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return NextResponse.json(
        { error: "Email already in use!" },
        { status: 400 }
      );
    }

    const verificationToken = await generateVerificationToken(values.email);
    if (!verificationToken) {
      return NextResponse.json(
        { error: "Verification token can't be created!" },
        { status: 400 }
      );
    }
    try {
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Verification token can't be sent!" },
        { status: 400 }
      );
    }
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return NextResponse.json(
        { error: "Incorrect password!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  if (!isAdmin(user?.role as UserRole)) {
    values.role = undefined;
  }

  try {
    await db.user.update({
      where: {
        id: dbUser.id,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(
      { success: "Updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
