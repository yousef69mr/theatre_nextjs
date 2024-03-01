import { currentRole, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { castMemberSchema } from "@/lib/validations/models/cast-member";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
interface CastMemberProps {
  params: {
    castMemberId: string;
  };
}

export async function GET(request: NextRequest, props: CastMemberProps) {
  const {
    params: { castMemberId },
  } = props;

  if (!castMemberId) {
    return NextResponse.json(
      { error: "castMemberId is required" },
      { status: 400 }
    );
  }
  try {
    const castMember = await db.castMember.findUnique({
      where: {
        id: castMemberId,
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            nickname: true,
            imgUrl: true,
          },
        },
      },
    });

    if (!castMember) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(castMember, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: CastMemberProps) {
  const {
    params: { castMemberId },
  } = props;
  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!castMemberId) {
    return NextResponse.json(
      { error: "castMemberId is missing!" },
      { status: 400 }
    );
  }

  // console.log("herer");
  try {
    await db.castMember.delete({
      where: {
        id: castMemberId,
      },
    });
    return NextResponse.json(
      { success: "cast member deleted successfully" },
      { status: 204 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, props: CastMemberProps) {
  const {
    params: { castMemberId },
  } = props;

  const currentUserRole = await currentRole();

  if (!isAdmin(currentUserRole as UserRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!castMemberId) {
    return NextResponse.json({ error: "castMemberId is missing!" }, { status: 400 });
  }
  const values = await request.json();

  const validatedFields = castMemberSchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const { startDate, endDate } = validatedFields.data;

  if (!startDate) {
    return NextResponse.json(
      { error: "startDate is missing!" },
      { status: 400 }
    );
  }

  // console.log(actorId);

  // console.log("herer");
  try {
    const castMember = await db.castMember.update({
      where: {
        id: castMemberId,
      },
      data: {
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            nickname: true,
            imgUrl: true,
          },
        },
      },
    });

    return NextResponse.json(castMember, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
