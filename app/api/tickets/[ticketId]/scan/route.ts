import { currentRole, isAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/database";

interface TicketProps {
  params: {
    ticketId: string;
  };
}
export async function POST(request: NextRequest, props: TicketProps) {
  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    params: { ticketId },
  } = props;
  try {
    const ticket = await db.ticket.findUnique({
      where: {
        id: ticketId,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    if (ticket.isScanned) {
      return NextResponse.json(
        { error: "ticket is already scanned" },
        { status: 406 }
      );
    }

    const scannedTicket = await db.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        isScanned: true,
      },
    });

    return NextResponse.json(scannedTicket, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
