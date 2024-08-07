import { currentRole, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { playSchema } from "@/lib/validations/models/play";
import { ExecutorRole, UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
interface PlayProps {
  params: {
    playId: string;
  };
}
export async function GET(request: NextRequest, props: PlayProps) {
  const {
    params: { playId },
  } = props;

  const searchParams = request.nextUrl.searchParams;

  if (!playId) {
    return NextResponse.json({ error: "playId is required" }, { status: 400 });
  }
  const viewIncrement = searchParams.get("viewIncrement") || "false";

  try {
    let play;
    if (JSON.parse(viewIncrement)) {
      play = await db.play.update({
        where: {
          id: playId,
        },
        data: {
          numOfViews: {
            increment: 1,
          },
        },
        include: {
          executors: {
            include: {
              executor: {
                select: {
                  id: true,
                  name: true,
                  facultyCast: true,
                  nickname: true,
                  numOfViews: true,
                  imgUrl: true,
                  awards: true,
                },
              },
              play: {
                select: {
                  id: true,
                  name: true,
                },
              },
              festival: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          awards: true,
          actors: {
            include: {
              actor: {
                select: {
                  id: true,
                  name: true,
                  nickname: true,
                  facultyCast: true,
                  numOfViews: true,
                  imgUrl: true,
                  awards: true,
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
          },
          tickets: true,
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
    } else {
      play = await db.play.findFirst({
        where: {
          id: playId,
        },
        include: {
          executors: {
            include: {
              executor: {
                select: {
                  id: true,
                  name: true,
                  facultyCast: true,
                  numOfViews: true,
                  nickname: true,
                  imgUrl: true,
                  awards: true,
                },
              },
              play: {
                select: {
                  id: true,
                  name: true,
                },
              },
              festival: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          awards: true,
          actors: {
            include: {
              actor: {
                select: {
                  id: true,
                  name: true,
                  nickname: true,
                  facultyCast: true,
                  imgUrl: true,
                  numOfViews: true,
                  awards: true,
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
          },
          tickets: true,
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
    }

    if (!play) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const formattedPlayActors = play.actors.map((actorLink) => ({
      ...actorLink,
      actor: {
        ...actorLink.actor,
        numOfViews: actorLink.actor.numOfViews.toString(),
      },
    }));

    const formattedPlayExecutors = play.executors.map((executorLink) => ({
      ...executorLink,
      executor: {
        ...executorLink.executor,
        numOfViews: executorLink.executor.numOfViews.toString(),
      },
    }));

    return NextResponse.json(
      {
        ...play,
        numOfViews: play.numOfViews.toString(),
        actors: formattedPlayActors,
        executors: formattedPlayExecutors,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: PlayProps) {
  const {
    params: { playId },
  } = props;

  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!playId) {
    return NextResponse.json({ error: "playId is required" }, { status: 400 });
  }
  try {
    await db.play.delete({
      where: {
        id: playId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, props: PlayProps) {
  const {
    params: { playId },
  } = props;

  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!playId) {
    return NextResponse.json({ error: "playId is required" }, { status: 400 });
  }

  const values = await request.json();

  const validatedFields = playSchema.safeParse({
    ...values,
    showTime: new Date(values.showTime),
  });
  // console.log(validatedFields.error);
  
  if (!validatedFields.success) {
    console.log(validatedFields.error)
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const {
    posterImgUrl,
    name,
    // images,
    // festivalId,
    // showTime,
    description,
    // videoUrl,
    executorId,
    isPublished,
  } = values;

  // if (!posterImgUrl) {
  //   return NextResponse.json(
  //     { error: "posterImgUrl is missing!" },
  //     { status: 400 }
  //   );
  // }
  if (!name) {
    return NextResponse.json({ error: "name is missing!" }, { status: 400 });
  }

  if (!executorId) {
    return NextResponse.json(
      { error: "executorId is missing!" },
      { status: 400 }
    );
  }
  // Get the director by id and check if it exists
  const director = await db.executor.findFirst({
    where: {
      id: executorId,
    },
  });

  if (!director) {
    return NextResponse.json({ error: "executor not found!" }, { status: 404 });
  }

  // const play = await db.play.update({
  //   where: {
  //     id: playId,
  //   },
  // )

  try {
    const existingDirector = await db.executorInPlay.findFirst({
      where: {
        playId,
        role: ExecutorRole.DIRECTOR,
      },
    });

    if (!existingDirector) {
      const playFestival = await db.playFestival.findFirst({
        where: {
          playId,
        },
      });

      if (playFestival) {
        await db.executorInPlay.create({
          data: {
            festival: { connect: { id: playFestival.id } },
            executor: { connect: { id: executorId } },
            play: { connect: { id: playId } },
            role: ExecutorRole.DIRECTOR,
          },
        });
      }
    } else {
      //update director
      await db.executorInPlay.updateMany({
        where: {
          playId,
          role: ExecutorRole.DIRECTOR,
        },
        data: {
          executorId,
        },
      });
    }

    const play = await db.play.update({
      where: {
        id: playId,
      },
      data: {
        name,
        posterImgUrl,
        
        // images,

        description,
        isPublished,
      },
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
            festival: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        tickets: true,
        awards: true,
        actors: {
          include: {
            actor: {
              select: {
                id: true,
                name: true,
                nickname: true,
                imgUrl: true,
                facultyCast: true,
              },
            },
          },
        },
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

    return NextResponse.json(
      { ...play, numOfViews: play.numOfViews.toString() },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
