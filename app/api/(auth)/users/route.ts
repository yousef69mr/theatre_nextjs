import { currentUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // const loggedUser = await currentUser();

  // console.log(loggedUser?.role);
  // if (!isAdmin(loggedUser?.role as UserRole)) {
  //   return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
  // }
  try {
    const users = await db.user.findMany({
      include: {
        tickets: true,
      },
    });
    return NextResponse.json(users, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
