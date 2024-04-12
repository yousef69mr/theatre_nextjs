import { currentRole, currentUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { userActorLinkSchema } from "@/lib/validations/actions/link-model-actions";

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
    if (remaining === "actor") {
      const actors = (
        await db.actor.findMany({
          where: {
            user: null,
          },
          // include: {
          //   user: true,
          // },
        })
      ).map((actor) => ({
        ...actor,
        numOfViews: actor.numOfViews.toString(),
      }));
      // console.log(actors);
      return NextResponse.json(actors, { status: 200 });
    } else if (remaining === "user") {
      const users = await db.user.findMany({
        where: {
          actor: null,
        },
      });
      return NextResponse.json(users, { status: 200 });
    }

    const userActorLinks = await db.userActorLink.findMany();

    return NextResponse.json(userActorLinks, { status: 200 });
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
    loggedUser?.role !== UserRole.USER
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const values = await request.json();

  const validatedFields = userActorLinkSchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const { userId, actorId } = validatedFields.data;

  // console.log("herer");
  try {
    const existingUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        executor: true,
      },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const actor = await db.actor.findUnique({ where: { id: actorId } });
    if (!actor) {
      return NextResponse.json({ error: "actor not found" }, { status: 404 });
    }

    const existingLink = await db.userActorLink.findFirst({
      where: {
        userId,
        actorId,
      },
    });

    if (existingLink) {
      return NextResponse.json(
        { error: "existing link is already exists" },
        { status: 406 }
      );
    }

    await db.userActorLink.create({
      data: {
        user: { connect: { id: userId } },
        actor: { connect: { id: actorId } },
      },
    });

    if (existingUser.executor) {
      await db.actorExecutorLink.create({
        data: {
          executor: { connect: { id: existingUser.executor.id } },
          actor: { connect: { id: actorId } },
        },
      });
    }

    let user;

    if (!isAdmin(existingUser.role)) {
      user = await db.user.update({
        where: { id: userId },
        data: {
          role: UserRole.ACTOR,
        },
      });
    } else {
      user = await db.user.findUnique({
        where: { id: userId },
      });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
