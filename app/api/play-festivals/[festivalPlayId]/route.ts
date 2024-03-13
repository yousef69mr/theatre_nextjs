import { currentRole, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { festivalPlaySchema } from "@/lib/validations/actions/link-model-actions";

import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
interface FestivalPlayProps {
  params: {
    festivalPlayId: string;
  };
}
export async function GET(request: NextRequest, props: FestivalPlayProps) {
  const {
    params: { festivalPlayId },
  } = props;

  if (!festivalPlayId) {
    return NextResponse.json(
      { error: "festivalPlayId is required" },
      { status: 400 }
    );
  }
  try {
    const festivalPlay = await db.playFestival.findFirst({
      where: {
        id: festivalPlayId,
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

    if (!festivalPlay) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    return NextResponse.json(festivalPlay, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: FestivalPlayProps) {
  const {
    params: { festivalPlayId },
  } = props;

  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!festivalPlayId) {
    return NextResponse.json(
      { error: "festivalPlayId is required" },
      { status: 400 }
    );
  }
  try {
    const oldFestivalPlay = await db.playFestival.findUnique({
      where: {
        id: festivalPlayId,
      },
    });

    if (!oldFestivalPlay) {
      return NextResponse.json({ error: "link not found!" }, { status: 404 });
    }

    //delete previous links with the old information

    await db.actorInPlay.deleteMany({
      where: {
        playId: oldFestivalPlay.playId,
        festivalId: oldFestivalPlay.festivalId,
      },
    });

    await db.playFestival.delete({
      where: {
        id: festivalPlayId,
      },
    });

    return NextResponse.json(
      { success: "festival play link is deleted" },
      { status: 204 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, props: FestivalPlayProps) {
  const {
    params: { festivalPlayId },
  } = props;

  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!festivalPlayId) {
    return NextResponse.json(
      { error: "festivalPlayId is required" },
      { status: 400 }
    );
  }

  const values = await request.json();

  const validatedFields = festivalPlaySchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const { showTimes, festivalId, playId, position } = validatedFields.data;

  if (!festivalId) {
    return NextResponse.json(
      { error: "festivalId is missing!" },
      { status: 400 }
    );
  }
  if (!playId) {
    return NextResponse.json({ error: "actorId is missing!" }, { status: 400 });
  }
  // Get the festival by id and check if it ex

  const play = await db.play.findFirst({
    where: {
      id: playId,
    },
  });

  if (!play) {
    return NextResponse.json({ error: "play not found!" }, { status: 404 });
  }

  const festival = await db.festival.findFirst({
    where: {
      id: festivalId,
    },
  });

  if (!festival) {
    return NextResponse.json({ error: "festival not found!" }, { status: 404 });
  }

  try {
    const oldFestivalPlay = await db.playFestival.findUnique({
      where: {
        id: festivalPlayId,
      },
    });

    if (!oldFestivalPlay) {
      return NextResponse.json({ error: "link not found!" }, { status: 404 });
    }

    // //update previous links with the old information
    // await db.actorInPlay.deleteMany({
    //   where: {
    //     playId: oldFestivalPlay.playId,
    //     festivalId: oldFestivalPlay.festivalId,
    //   },
    // });

    const formatedShowtimes = showTimes.map((showTime) => new Date(showTime));

    const festivalPlay = await db.playFestival.update({
      where: {
        id: festivalPlayId,
      },
      data: {
        showTimes: formatedShowtimes,
        playId,
        festivalId,
        position,
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

    return NextResponse.json(festivalPlay, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
