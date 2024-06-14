import { currentRole, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { festivalPlaySchema } from "@/lib/validations/actions/link-model-actions";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const values = await request.json();

  const validatedFields = festivalPlaySchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const {
    playId,
    festivalId,
    showTimes,
    seatsLimit,
    actorTicketLimit,
    guestTicketLimit,
    videoUrl
  } = validatedFields.data;

  if (!festivalId) {
    return NextResponse.json(
      { error: "festivalId is missing!" },
      { status: 400 }
    );
  }

  if (!playId) {
    return NextResponse.json({ error: "playId is missing!" }, { status: 400 });
  }

  if (!showTimes) {
    return NextResponse.json(
      { error: "showTimes is missing!" },
      { status: 400 }
    );
  }

  if (!seatsLimit) {
    return NextResponse.json(
      { error: "seats limit is missing!" },
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

  const play = await db.play.findFirst({
    where: {
      id: playId,
    },
  });

  if (!play) {
    return NextResponse.json({ error: "play not found!" }, { status: 404 });
  }

  const tickets = await db.ticket.findMany({
    where: {
      playId,
      festivalId,
    },
  });
  // console.log("herer");
  const availableSeats = seatsLimit - tickets.length;
  const formatedShowtimes = showTimes.map((showTime) => new Date(showTime));
  try {
    const festivalPlay = await db.playFestival.create({
      data: {
        playId,
        showTimes: formatedShowtimes,
        festivalId,
        seatsLimit,
        availableSeats: availableSeats > 0 ? availableSeats : 0,
        actorTicketLimit,
        guestTicketLimit,
        videoUrl
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

    // console.log(play);

    return NextResponse.json(festivalPlay, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
