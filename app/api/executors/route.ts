import { currentRole, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { executorSchema } from "@/lib/validations/models/executor";

import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const executors = (
      await db.executor.findMany({
        include: {
          awards: true,
          
          plays: {
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
        },
      })
    ).map((executor) => ({
      ...executor,
      numOfViews: executor.numOfViews.toString(),
    }));

    return NextResponse.json(executors, { status: 200 });
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

  const validatedFields = executorSchema.safeParse(values);
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
    const executor = await db.executor.create({
      data: {
        name,
        imgUrl,
        nickname,
      },
      include: {
        awards: true,
        plays: {
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

    // console.log(play);

    return NextResponse.json(
      { ...executor, numOfViews: executor.numOfViews.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
