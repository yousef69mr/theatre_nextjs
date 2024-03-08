import { currentRole, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { playSchema } from "@/lib/validations/models/play";
import { ExecutorRole, UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const plays = (
      await db.play.findMany({
        include: {
          executors: {
            include: {
              executor: {
                select: {
                  id: true,
                  name: true,
                  nickname: true,
                  imgUrl: true,
                },
              },
            },
          },
          actors: {
            include: {
              actor: {
                select: {
                  id: true,
                  name: true,
                  nickname: true,
                  imgUrl: true,
                },
              },
            },
          },
          awards: true,
          festivals: {
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
                },
              },
            },
          },
        },
      })
    ).map((play) => ({
      ...play,
      numOfViews: play.numOfViews.toString(),
    }));

    return NextResponse.json(plays, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const values = await request.json();

  const validatedFields = playSchema.safeParse({
    ...values,
    showTime: new Date(values.showTime),
  });
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const {
    posterImgUrl,
    name,
    images,
    festivalId,
    showTime,
    videoUrl,
    executorId,
    description,
  } = values;

  if (!posterImgUrl) {
    return NextResponse.json(
      { error: "posterImgUrl is missing!" },
      { status: 400 }
    );
  }
  if (!name) {
    return NextResponse.json({ error: "name is missing!" }, { status: 400 });
  }

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

  if (!executorId) {
    return NextResponse.json(
      { error: "posterImgUrl is missing!" },
      { status: 400 }
    );
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

  // console.log("herer");
  try {
    const play = await db.play.create({
      data: {
        posterImgUrl,
        name,
        images: images || [],
        videoUrl,
        description,
        executors: {
          create: [
            {
              // executorId: executorId,
              festival: { connect: { id: festivalId } },
              executor: {
                connect: { id: executorId },
              },
              role: ExecutorRole.DIRECTOR,
            },
          ],
        },
        festivals: {
          create: [
            {
              showTimes: [showTime],
              festival: {
                connect: { id: festivalId },
              },
            },
          ],
        },
      },
      include: {
        actors: {
          include: {
            actor: {
              select: {
                id: true,
                name: true,
                nickname: true,
                imgUrl: true,
              },
            },
          },
        },
        executors: {
          include: {
            executor: {
              select: {
                id: true,
                name: true,
                nickname: true,
                imgUrl: true,
              },
            },
          },
        },
        awards: true,
        festivals: {
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
              },
            },
          },
        },
      },
    });

    // console.log(play);

    const formattedPlay = { ...play, numOfViews: play.numOfViews.toString() };

    return NextResponse.json(formattedPlay, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
