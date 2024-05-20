import { currentRole, currentUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { ticketSchema } from "@/lib/validations/models/ticket";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
interface TicketProps {
  params: {
    ticketId: string;
  };
}
export async function GET(request: NextRequest, props: TicketProps) {
  const {
    params: { ticketId },
  } = props;

  if (!ticketId) {
    return NextResponse.json(
      { error: "ticketId is required" },
      { status: 400 }
    );
  }
  try {
    const ticket = await db.ticket.findUnique({
      where: {
        id: ticketId,
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

    if (!ticket) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: TicketProps) {
  const {
    params: { ticketId },
  } = props;

  try {
    const loggedUser = await currentUser();

    if (!ticketId) {
      return NextResponse.json(
        { error: "ticketId is missing!" },
        { status: 400 }
      );
    }

    const existingTicket = await db.ticket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingTicket) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const isLoggedUserTicket = existingTicket.createdBy?.id === loggedUser?.id;

    if (!isAdmin(loggedUser?.role as UserRole) && !isLoggedUserTicket) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // console.log("herer");

    await db.ticket.delete({
      where: {
        id: ticketId,
      },
    });

    // increase available play ticket
    const playFestival = await db.playFestival.findFirst({
      where: {
        festivalId: existingTicket.festivalId,
        playId: existingTicket.playId,
      },
    });
    await db.playFestival.updateMany({
      where: {
        festivalId: existingTicket.festivalId,
        playId: existingTicket.playId,
      },
      data: {
        availableSeats: playFestival?.availableSeats
          ? playFestival?.availableSeats + 1
          : undefined,
      },
    });

    return NextResponse.json(
      { success: "ticket deleted successfully" },
      { status: 204 }
    );
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, props: TicketProps) {
  const {
    params: { ticketId },
  } = props;

  const loggedUser = await currentUser();

  if (!ticketId) {
    return NextResponse.json(
      { error: "ticketId is missing!" },
      { status: 400 }
    );
  }
  try {
    const existingTicket = await db.ticket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingTicket) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const isLoggedUserTicket = existingTicket.createdBy?.id === loggedUser?.id;

    if (!isAdmin(loggedUser?.role as UserRole) && !isLoggedUserTicket) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const values = await request.json();

    const validatedFields = ticketSchema.safeParse(values);
    // console.log(validatedFields);
    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }

    const { guestName } = validatedFields.data;

    if (!guestName) {
      return NextResponse.json(
        { error: "guestName is missing!" },
        { status: 400 }
      );
    }

    // console.log(ticketId);

    // console.log("herer");

    const ticket = await db.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        guestName,
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

    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
