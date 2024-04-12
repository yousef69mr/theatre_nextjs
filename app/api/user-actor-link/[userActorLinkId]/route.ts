import { currentRole, currentUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { userActorLinkSchema } from "@/lib/validations/actions/link-model-actions";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
interface userActorLinkProps {
  params: {
    userActorLinkId: string;
  };
}
export async function DELETE(request: NextRequest, props: userActorLinkProps) {
  const loggedUser = await currentUser();
  const {
    params: { userActorLinkId },
  } = props;

  if (
    !isAdmin(loggedUser?.role as UserRole) &&
    loggedUser?.role !== UserRole.ACTOR
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const values = await request.json();

  const validatedFields = userActorLinkSchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  if (!userActorLinkId) {
    return NextResponse.json(
      { error: "userActorLinkId is missing" },
      { status: 400 }
    );
  }

  const { userId, actorId } = validatedFields.data;
  // console.log("herer");
  try {
    await db.userActorLink.delete({
      where: {
        id: userActorLinkId,
      },
    });

    // const existingUser = await db.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    //   include: {
    //     executor: true,
    //   },
    // });
    // if (existingUser?.executor) {
    //   //deleting executor actor link
    //   await db.actorExecutorLink.delete({
    //     where: {
    //       actorId,
    //     },
    //   });
    // }

    if (!isAdmin(loggedUser?.role as UserRole)) {
      await db.user.update({
        where: { id: userId },
        data: {
          role: UserRole.USER,
        },
      });
    }

    return NextResponse.json(
      { success: "link deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
