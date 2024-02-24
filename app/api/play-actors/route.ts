import { currentRole, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { actorInPlaySchema } from "@/lib/validations/actions/link-model-actions";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const values = await request.json();

  const validatedFields = actorInPlaySchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const { actorId, playId, festivalId } = validatedFields.data;

  if (!festivalId) {
    return NextResponse.json(
      { error: "festivalId is missing!" },
      { status: 400 }
    );
  }

  if (!playId) {
    return NextResponse.json({ error: "playId is missing!" }, { status: 400 });
  }

  if (!actorId) {
    return NextResponse.json({ error: "actorId is missing!" }, { status: 400 });
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

  const actor = await db.actor.findFirst({
    where: {
      id: actorId,
    },
  });

  if (!actor) {
    return NextResponse.json({ error: "actor not found!" }, { status: 404 });
  }

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
    const actorInPlay = await db.actorInPlay.create({
      data: {
        playId,
        actorId,
        festivalId,
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            imgUrl: true,
          },
        },
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

  

    return NextResponse.json(actorInPlay, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
