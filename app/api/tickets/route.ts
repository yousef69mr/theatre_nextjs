import { currentUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { ticketSchema } from "@/lib/validations/models/ticket";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const filter: Record<string, any> = {};

  const isScanned = searchParams.get("isScanned");
  const playId = searchParams.get("playId");
  const festivalId = searchParams.get("festivalId");

  if (isScanned !== null) {
    filter["isScanned"] = JSON.parse(isScanned);
  }

  if (playId !== null) {
    filter["playId"] = playId;
  }
  if (festivalId !== null) {
    filter["festivalId"] = festivalId;
  }

  try {
    const tickets = await db.ticket.findMany({
      where: {
        ...filter,
      },
      include: {
        play: {
          select: {
            id: true,
            name: true,
            posterImgUrl: true,
          },
        },
        festival: {
          select: {
            id: true,
            name: true,
            imgUrl: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const loggedUser = await currentUser();

  if (!isAdmin(loggedUser?.role as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const values = await request.json();

  const validatedFields = ticketSchema.safeParse({
    ...values,
    showTime: new Date(values.showTime),
  });
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const {
    guestName,
    // images,
    playId,
    showTime,
    festivalId,
  } = values;

  // if (!posterImgUrl) {
  //   return NextResponse.json(
  //     { error: "posterImgUrl is missing!" },
  //     { status: 400 }
  //   );
  // }
  //   if (!name) {
  //     return NextResponse.json({ error: "name is missing!" }, { status: 400 });
  //   }

  if (!showTime) {
    return NextResponse.json(
      { error: "showTime is missing!" },
      { status: 400 }
    );
  }

  if (!festivalId) {
    return NextResponse.json(
      { error: "festivalId is missing!" },
      { status: 400 }
    );
  }
  // Get the festival by id and check if it exists
  const festival = await db.festival.findFirst({
    where: {
      id: festivalId,
    },
  });

  if (!festival) {
    return NextResponse.json({ error: "festival not found!" }, { status: 404 });
  }

  if (!playId) {
    return NextResponse.json(
      { error: "posterImgUrl is missing!" },
      { status: 400 }
    );
  }
  // Get the play by id and check if it exists
  const play = await db.play.findFirst({
    where: {
      id: playId,
    },
  });

  if (!play) {
    return NextResponse.json({ error: "play not found!" }, { status: 404 });
  }

  // console.log("herer");
  try {
    const ticket = await db.ticket.create({
      data: {
        userId: loggedUser?.id,
        // images: images || [],
        guestName,
        showTime: new Date(showTime),
        festivalId,
        playId,
      },
      include: {
        play: {
          select: {
            id: true,
            name: true,
            posterImgUrl: true,
          },
        },
        festival: {
          select: {
            id: true,
            name: true,
            imgUrl: true,
          },
        },
      },
    });

    // console.log(ticket);

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
