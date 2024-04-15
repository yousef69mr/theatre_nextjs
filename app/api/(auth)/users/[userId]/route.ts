import { currentUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { userSchema } from "@/lib/validations/models/user";
import { UserRole } from "@prisma/client";
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
  const LoggedUser = await currentUser();

  const {
    params: { userId },
  } = props;

  if (!userId) {
    return NextResponse.json({ error: "userId is missing!" }, { status: 400 });
  }

  if (!isAdmin(LoggedUser?.role as UserRole) && LoggedUser?.id !== userId) {
    return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
  }

  if (!LoggedUser?.isEditable && LoggedUser?.id !== userId) {
    return NextResponse.json(
      { error: "this user can't be deleted by any user even admins!!" },
      { status: 403 }
    );
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

export async function PATCH(request: NextRequest, props: UserProps) {
  const LoggedUser = await currentUser();

  const {
    params: { userId },
  } = props;

  if (!userId) {
    return NextResponse.json({ error: "userId is missing!" }, { status: 400 });
  }

  if (!isAdmin(LoggedUser?.role as UserRole) && LoggedUser?.id !== userId) {
    return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
  }

  if (!LoggedUser?.isEditable && LoggedUser?.id !== userId) {
    return NextResponse.json(
      { error: "this user can't be modified by any user even admins!!" },
      { status: 403 }
    );
  }

  const values = await request.json();

  const validatedFields = userSchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const {role,name} = validatedFields.data;

  try {
    const user = await db.user.update({
      where: {
        id: userId,
      },
      data:{

      }
    });

    return NextResponse.json(user, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
