import { getUserByEmail, getUserById } from "@/lib/actions/models/user";
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

  const dbUser = await getUserById(LoggedUser?.id as string);

  if (!dbUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isUserAdmin = isAdmin(LoggedUser?.role as UserRole);

  if (!isUserAdmin) {
    return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
  }

  if (!userId) {
    return NextResponse.json({ error: "userId is missing!" }, { status: 400 });
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

  // if (LoggedUser.isOAuth) {
  //   values.email = undefined;
  //   values.password = undefined;
  //   values.newPassword = undefined;
  //   values.isTwoFactorEnabled = undefined;
  // }

  if (!isUserAdmin) {
    values.role = undefined;
  } else {
    // change email of existing user admin only
    if (values.email && values.email !== dbUser.email) {
      const existingUser = await getUserByEmail(values.email);
      if (existingUser && existingUser.id !== LoggedUser.id) {
        return NextResponse.json(
          { error: "Email already in use!" },
          { status: 400 }
        );
      }
      values.emailVerified = new Date();
    }
  }

  if (values.password && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return NextResponse.json(
        { error: "Incorrect password!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    // values.newPassword = undefined;
  }

  try {
    const user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
