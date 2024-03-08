import { currentRole, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { actorSchema } from "@/lib/validations/models/actor";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
interface ActorProps {
  params: {
    actorId: string;
  };
}
export async function GET(request: NextRequest, props: ActorProps) {
  const {
    params: { actorId },
  } = props;

  if (!actorId) {
    return NextResponse.json({ error: "actorId is required" }, { status: 400 });
  }
  try {
    const actor = await db.actor.findUnique({
      where: {
        id: actorId,
      },
      include: {
        plays: {
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
                festivals: {
                  select: {
                    id: true,
                    festival: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
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
        castMembers: {
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
      },
    });

    if (!actor) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      { ...actor, numOfViews: actor.numOfViews.toString() },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: ActorProps) {
  const {
    params: { actorId },
  } = props;
  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!actorId) {
    return NextResponse.json({ error: "actorId is missing!" }, { status: 400 });
  }

  // console.log("herer");
  try {
    await db.actor.delete({
      where: {
        id: actorId,
      },
    });
    return NextResponse.json(
      { success: "actor deleted successfully" },
      { status: 204 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, props: ActorProps) {
  const {
    params: { actorId },
  } = props;

  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!actorId) {
    return NextResponse.json({ error: "actorId is missing!" }, { status: 400 });
  }
  const values = await request.json();

  const validatedFields = actorSchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const { name, imgUrl, isPublished, nickname, description } =
    validatedFields.data;

  if (!name) {
    return NextResponse.json({ error: "name is missing!" }, { status: 400 });
  }

  // console.log(actorId);

  // console.log("herer");
  try {
    const actor = await db.actor.update({
      where: {
        id: actorId,
      },
      data: {
        name,
        imgUrl,
        nickname,
        description,
        isPublished,
      },
      include: {
        awards: true,
        castMembers: {
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
        plays: {
          include: {
            actor: {
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
                festivals: {
                  select: {
                    id: true,
                    festival: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
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
      },
    });

    return NextResponse.json(
      { ...actor, numOfViews: actor.numOfViews.toString() },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
