import { currentRole, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { executorInPlaySchema } from "@/lib/validations/actions/link-model-actions";

import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
interface actorInPlayProps {
  params: {
    executorInPlayId: string;
  };
}
export async function GET(request: NextRequest, props: actorInPlayProps) {
  const {
    params: { executorInPlayId },
  } = props;

  if (!executorInPlayId) {
    return NextResponse.json(
      { error: "executorInPlayId is required" },
      { status: 400 }
    );
  }
  try {
    const executorInPlay = await db.executorInPlay.findFirst({
      where: {
        id: executorInPlayId,
      },
      include: {
        executor: {
          select: {
            id: true,
            name: true,
            nickname: true,
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

    if (!executorInPlay) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    return NextResponse.json(executorInPlay, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: actorInPlayProps) {
  const {
    params: { executorInPlayId },
  } = props;

  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!executorInPlayId) {
    return NextResponse.json(
      { error: "executorInPlayId is required" },
      { status: 400 }
    );
  }
  try {
    await db.executorInPlay.delete({
      where: {
        id: executorInPlayId,
      },
    });

    return NextResponse.json(
      { success: "executor play link is deleted" },
      { status: 204 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, props: actorInPlayProps) {
  const {
    params: { executorInPlayId },
  } = props;

  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!executorInPlayId) {
    return NextResponse.json(
      { error: "executorInPlayId is required" },
      { status: 400 }
    );
  }

  const values = await request.json();

  const validatedFields = executorInPlaySchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const { executorId, festivalId, playId } = validatedFields.data;

  if (!executorId) {
    return NextResponse.json(
      { error: "executorId is missing!" },
      { status: 400 }
    );
  }
  if (!festivalId) {
    return NextResponse.json(
      { error: "festivalId is missing!" },
      { status: 400 }
    );
  }
  if (!playId) {
    return NextResponse.json({ error: "actorId is missing!" }, { status: 400 });
  }
  // Get the festival by id and check if it exists
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

  const festival = await db.festival.findFirst({
    where: {
      id: festivalId,
    },
  });

  if (!festival) {
    return NextResponse.json({ error: "festival not found!" }, { status: 404 });
  }

  try {
    //update director
    const executorInPlay = await db.executorInPlay.update({
      where: {
        id: executorInPlayId,
      },
      data: {
        playId,
        festivalId,
        executorId,
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

    return NextResponse.json(executorInPlay, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
