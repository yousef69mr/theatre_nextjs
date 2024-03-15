import { currentUser } from "@/lib/auth";
import { db } from "@/lib/database";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const loggedUser = await currentUser();

  if (!loggedUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userTickets = await db.ticket.findMany({
      where: {
        userId: loggedUser?.id,
      },
      include: {
        festival: {
          select: {
            id: true,
            name: true,
          },
        },
        play: {
          select: {
            id: true,
            name: true,
            posterImgUrl: true,
          },
        },
      },
    });

    console.log(userTickets);
    return NextResponse.json(userTickets, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}