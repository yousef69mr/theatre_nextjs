import { currentRole, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { executorSchema } from "@/lib/validations/models/executor";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
interface ExecutorProps {
  params: {
    executorId: string;
  };
}
export async function GET(request: NextRequest, props: ExecutorProps) {
  const {
    params: { executorId },
  } = props;

  if (!executorId) {
    return NextResponse.json(
      { error: "executorId is required" },
      { status: 400 }
    );
  }
  try {
    const executor = await db.executor.findFirst({
      where: {
        id: executorId,
      },
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
                awards:true,
                festivals: {
                  select: {
                    id: true,
                    showTimes: true,
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

    if (!executor) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    return NextResponse.json(
      { ...executor, numOfViews: executor.numOfViews.toString() },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: ExecutorProps) {
  const {
    params: { executorId },
  } = props;
  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!executorId) {
    return NextResponse.json(
      { error: "executorId is missing!" },
      { status: 400 }
    );
  }

  // console.log("herer");
  try {
    await db.executor.delete({
      where: {
        id: executorId,
      },
    });
    return NextResponse.json(
      { success: "executor deleted successfully" },
      { status: 204 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, props: ExecutorProps) {
  const {
    params: { executorId },
  } = props;

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

  const { name, imgUrl, isPublished, nickname, description } =
    validatedFields.data;

  if (!name) {
    return NextResponse.json({ error: "name is missing!" }, { status: 400 });
  }

  // console.log("herer");
  try {
    const executor = await db.executor.update({
      where: {
        id: executorId,
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
      { ...executor, numOfViews: executor.numOfViews.toString() },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
