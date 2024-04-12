import { currentRole, currentUser, isAdmin, isPublic } from "@/lib/auth";
import { db } from "@/lib/database";
import { userExecutorLinkSchema } from "@/lib/validations/actions/link-model-actions";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
interface userExecutorLinkProps {
  params: {
    userExecutorLinkId: string;
  };
}
export async function DELETE(
  request: NextRequest,
  props: userExecutorLinkProps
) {
  const loggedUser = await currentUser();
  const {
    params: { userExecutorLinkId },
  } = props;

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

  if (!userExecutorLinkId) {
    return NextResponse.json(
      { error: "userExecutorLinkId is missing" },
      { status: 400 }
    );
  }

  const { userId, executorId } = validatedFields.data;
  // console.log("herer");
  try {

    const existingUser = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        actor: true,
      },
    });

    // if (existingUser?.actor) {
    //   //deleting executor actor link
    //   await db.actorExecutorLink.delete({
    //     where: {
    //       executorId,
    //     },
    //   });
    // }

    if (!isAdmin(loggedUser?.role as UserRole) && !existingUser?.actor) {
      await db.user.update({
        where: { id: userId },
        data: {
          role: UserRole.USER,
        },
      });
    }


    await db.userExecutorLink.delete({
      where: {
        id: userExecutorLinkId,
      },
    });

    return NextResponse.json(
      { success: "link deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
