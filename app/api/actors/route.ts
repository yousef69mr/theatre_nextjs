import { currentRole, currentUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { actorSchema } from "@/lib/validations/models/actor";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const actors = (
      await db.actor.findMany({
        include: {
          awards: true,
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
      })
    ).map((actor) => ({
      ...actor,
      numOfViews: actor.numOfViews.toString(),
    }));
    return NextResponse.json(actors, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const values = await request.json();

  const validatedFields = actorSchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const { name, imgUrl, nickname } = values;

  if (!name) {
    return NextResponse.json({ error: "name is missing!" }, { status: 400 });
  }

  // console.log("herer");
  try {
    const actor = await db.actor.create({
      data: {
        name,
        imgUrl,
        nickname,
        castMember: {
          create: {
            role: UserRole.ACTOR,
          },
        },
      },
      include: {
        awards: true,
        castMember: true,
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
      },
    });

    return NextResponse.json(
      { ...actor, numOfViews: actor.numOfViews.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
