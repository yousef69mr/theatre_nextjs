import { currentRole, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { festivalSchema } from "@/lib/validations/models/festival";
import { UserRole } from "@prisma/client";
// import { festivalSchema } from "@/lib/validations/models/festival";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const festivals = await db.festival.findMany({
      include: {
        executors: {
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
        },
        actors: {
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
        plays: {
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
        },
      },
    });
    // console.log(festivals);
    return NextResponse.json(festivals, { status: 200 });
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

  const validatedFields = festivalSchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const { imgUrl, description, name } = validatedFields.data;

  if (!name) {
    return NextResponse.json({ error: "name is missing!" }, { status: 400 });
  }

  // console.log("herer");
  try {
    const festival = await db.festival.create({
      data: {
        imgUrl,
        description,
        name,
      },
      include: {
        executors: {
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
        },
        actors: {
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
        plays: {
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
        },
      },
    });

    // console.log(play);

    return NextResponse.json(festival, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
