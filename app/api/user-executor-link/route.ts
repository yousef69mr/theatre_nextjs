import { currentUser, isAdmin, isPublic } from "@/lib/auth";
import { db } from "@/lib/database";
import { userExecutorLinkSchema } from "@/lib/validations/actions/link-model-actions";

import { Prisma, UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// interface UserActorLinkProps {
//   searchParams?: { [key: string]: string | string[] | undefined };
// }

export async function GET(request: NextRequest) {
  // const { searchParams } = props;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const remaining = searchParams?.get("remaining");

  try {
    if (remaining === "executor") {
      const executors = (
        await db.executor.findMany({
          where: {
            user: null,
          },
          // include: {
          //   user: true,
          // },
        })
      ).map((executor) => ({
        ...executor,
        numOfViews: executor.numOfViews.toString(),
      }));
      // console.log(actors);
      return NextResponse.json(executors, { status: 200 });
    } else if (remaining === "user") {
      const users = await db.user.findMany({
        where: {
          actor: null,
        },
      });
      return NextResponse.json(users, { status: 200 });
    }

    const userExecutorLinks = await db.userExecutorLink.findMany();

    return NextResponse.json(userExecutorLinks, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 }); // Bad request for invalid queries
    } else {
      // Handle other errors (e.g., database connection issues)
      console.error(error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  const loggedUser = await currentUser();

  if (
    !isAdmin(loggedUser?.role as UserRole) &&
    !isPublic(loggedUser?.role as UserRole)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const values = await request.json();

  const validatedFields = userExecutorLinkSchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const { userId, executorId } = validatedFields.data;

  // console.log("herer");
  try {
    const existingUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        actor: true,
      },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const executor = await db.executor.findUnique({
      where: { id: executorId },
    });
    if (!executor) {
      return NextResponse.json(
        { error: "executor not found" },
        { status: 404 }
      );
    }
    const existingLink = await db.userExecutorLink.findFirst({
      where: {
        userId,
        executorId,
      },
    });

    if (existingLink) {
      return NextResponse.json(
        { error: "existing link is already exists" },
        { status: 406 }
      );
    }

    await db.userExecutorLink.create({
      data: {
        user: { connect: { id: userId } },
        executor: { connect: { id: executorId } },
      },
    });

    if (existingUser.actor) {
      await db.actorExecutorLink.create({
        data: {
          actorId: existingUser.actor.id,
          executorId,
        },
      });
    }

    console.log("Executor");
    let user;

    // if (!isAdmin(existingUser.role)) {
    // user = await db.user.update({
    //   where: { id: userId },
    //   data: {
    //     role: UserRole.ACTOR,
    //   },
    // });
    // } else {
    user = await db.user.findUnique({
      where: { id: userId },
    });
    // }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
