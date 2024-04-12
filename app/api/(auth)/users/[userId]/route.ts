import { db } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
interface UserProps {
  params: {
    userId: string;
  };
}

export async function GET(request: NextRequest, props: UserProps) {
  const {
    params: { userId },
  } = props;

  if (!userId) {
    return NextResponse.json({ error: "userId is missing!" }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        tickets: true,
        actor: {
          include: {
            actor: {
              select: {
                id: true,
                nickname: true,
                name: true,
                imgUrl: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        executor: {
          include: {
            executor: {
              select: {
                id: true,
                nickname: true,
                name: true,
                imgUrl: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const formattedUser = {
      ...user,
    };

    return NextResponse.json(formattedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: UserProps) {
  const {
    params: { userId },
  } = props;

  if (!userId) {
    return NextResponse.json({ error: "userId is missing!" }, { status: 400 });
  }

  try {
    const user = await db.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json(user, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
