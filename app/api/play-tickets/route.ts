import { currentUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { isPlayLive } from "@/lib/helpers/play-validations";
import { bookPlayTicketsSchema } from "@/lib/validations/actions/book-ticket-action";
import { PlayFestivalType } from "@/types";

import { UserRole } from "@prisma/client";
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
export async function POST(request: NextRequest) {
  const loggedUser = await currentUser();

  if (!loggedUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const values = await request.json();

  const validatedFields = bookPlayTicketsSchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  try {
    const { playId, festivalId, showTime, guestNames } = validatedFields.data;

    if (!festivalId) {
      return NextResponse.json(
        { error: "festivalId is missing!" },
        { status: 400 }
      );
    }

    if (!playId) {
      return NextResponse.json(
        { error: "playId is missing!" },
        { status: 400 }
      );
    }

    if (!showTime) {
      return NextResponse.json(
        { error: "showTime is missing!" },
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
      return NextResponse.json(
        { error: "festival not found!" },
        { status: 404 }
      );
    }

    const play = await db.play.findFirst({
      where: {
        id: playId,
      },
    });

    if (!play) {
      return NextResponse.json({ error: "play not found!" }, { status: 404 });
    }

    // check seats left
    const selectedPlayFestival = await db.playFestival.findFirst({
      where: {
        playId,
        festivalId,
      },
    });

    if (!selectedPlayFestival) {
      return NextResponse.json(
        { error: "play in festival link not found!" },
        { status: 404 }
      );
    }

    if (!isPlayLive([selectedPlayFestival] as unknown as PlayFestivalType[])) {
      return NextResponse.json(
        { error: "This play is not live yet." },
        { status: 406 }
      );
    }

    let availableSeats = selectedPlayFestival.availableSeats;

    if (availableSeats < guestNames.length) {
      return NextResponse.json(
        "remaining seats are less than the required amount",
        {
          status: 403,
        }
      );
    }
    const formatedShowtime = new Date(showTime);

    // calculate the number of available tickets for each guest at certain showTime
    const userTickets = await db.ticket.findMany({
      where: {
        userId: loggedUser?.id,
        showTime: formatedShowtime,
      },
    });

    let guestLimit;
    //number of guest names compared to the names limit based on role
    if (loggedUser?.role === UserRole.ACTOR) {
      guestLimit = selectedPlayFestival.actorTicketLimit - userTickets.length;
    } else if (loggedUser?.role === UserRole.USER) {
      // +1 means that the user can add himself as a guest
      guestLimit =
        selectedPlayFestival.guestTicketLimit + 1 - userTickets.length;
    } else if (isAdmin(loggedUser?.role as UserRole)) {
      guestLimit = selectedPlayFestival.seatsLimit * 2;
    } else {
      guestLimit = 0;
    }

    // console.log(guestLimit);

    let createdTickets = [];

    // create a ticket for the logged user if it is a normal user
    if (loggedUser?.role === UserRole.USER) {
      const userTicket = userTickets.find(
        (ticket) => ticket.userId === loggedUser.id
      );

      // create user ticket if he not having its own ticket
      if (!userTicket) {
        const ticket = await db.ticket.create({
          data: {
            showTime: formatedShowtime,
            playId,
            festivalId,
            guestName: loggedUser.name as string,
            seatNumber: availableSeats,
            userId: loggedUser?.id,
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
        createdTickets.push(ticket);
        availableSeats--;
        guestLimit--;
      }
    }
    // console.log(guestLimit, guestNames.length);
    if (guestLimit < guestNames.length && createdTickets.length > 0) {
      await db.playFestival.updateMany({
        where: {
          playId,
          festivalId,
        },
        data: {
          availableSeats,
        },
      });
      return NextResponse.json(createdTickets, { status: 202 });
    }
    if (guestLimit < guestNames.length) {
      return NextResponse.json(
        { error: "can't create more tickets for this user" },
        { status: 406 }
      );
    }
    for (let guestName of guestNames) {
      const ticket = await db.ticket.create({
        data: {
          showTime: formatedShowtime,
          playId,
          festivalId,
          guestName,
          seatNumber: availableSeats,
          userId: loggedUser?.id,
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
      createdTickets.push(ticket);
      availableSeats--;
      if (availableSeats < 1) {
        break;
      }
    }
    // console.log(play);

    await db.playFestival.updateMany({
      where: {
        playId,
        festivalId,
      },
      data: {
        availableSeats,
      },
    });

    return NextResponse.json(createdTickets, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
