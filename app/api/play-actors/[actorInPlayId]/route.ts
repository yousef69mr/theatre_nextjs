import { currentRole, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { actorInPlaySchema } from "@/lib/validations/actions/link-model-actions";
import { playSchema } from "@/lib/validations/models/play";
import { ExecutorRole, UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
interface actorInPlayProps {
  params: {
    actorInPlayId: string;
  };
}
export async function GET(request: NextRequest, props: actorInPlayProps) {
  const {
    params: { actorInPlayId },
  } = props;

  if (!actorInPlayId) {
    return NextResponse.json(
      { error: "actorInPlayId is required" },
      { status: 400 }
    );
  }
  try {
    const actorInPlay = await db.actorInPlay.findFirst({
      where: {
        id: actorInPlayId,
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

    if (!actorInPlay) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    return NextResponse.json(actorInPlay, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: actorInPlayProps) {
  const {
    params: { actorInPlayId },
  } = props;

  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!actorInPlayId) {
    return NextResponse.json(
      { error: "actorInPlayId is required" },
      { status: 400 }
    );
  }
  try {
    await db.actorInPlay.delete({
      where: {
        id: actorInPlayId,
      },
    });

    return NextResponse.json(
      { success: "actor play link is deleted" },
      { status: 204 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, props: actorInPlayProps) {
  const {
    params: { actorInPlayId },
  } = props;

  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!actorInPlayId) {
    return NextResponse.json(
      { error: "actorInPlayId is required" },
      { status: 400 }
    );
  }

  const values = await request.json();

  const validatedFields = actorInPlaySchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const { actorId, festivalId, playId, characterNames,imgUrl } = validatedFields.data;

  if (!actorId) {
    return NextResponse.json({ error: "actorId is missing!" }, { status: 400 });
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
    const actorInPlay = await db.actorInPlay.update({
      where: {
        id: actorInPlayId,
      },
      data: {
        actorId,
        playId,
        festivalId,
        characterNames: characterNames || [],
        imgUrl
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

    return NextResponse.json(actorInPlay, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
