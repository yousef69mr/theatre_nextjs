import { currentRole, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import {
  actorInPlaySchema,
  executorInPlaySchema,
} from "@/lib/validations/actions/link-model-actions";
import { ExecutorRole, UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const values = await request.json();

  const validatedFields = executorInPlaySchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const { executorId, playId, festivalId, role } = validatedFields.data;

  if (!festivalId) {
    return NextResponse.json(
      { error: "festivalId is missing!" },
      { status: 400 }
    );
  }

  if (!playId) {
    return NextResponse.json({ error: "playId is missing!" }, { status: 400 });
  }

  if (!executorId) {
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

  const executor = await db.executor.findFirst({
    where: {
      id: executorId,
    },
  });

  if (!executor) {
    return NextResponse.json({ error: "executor not found!" }, { status: 404 });
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
    const executorInPlay = await db.executorInPlay.create({
      data: {
        playId,
        executorId,
        festivalId,
        role,
      },
      include: {
        executor: {
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

    return NextResponse.json(executorInPlay, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
