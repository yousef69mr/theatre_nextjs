import { currentRole, currentUser, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { actorSchema } from "@/lib/validations/models/actor";
import { castMemberSchema } from "@/lib/validations/models/cast-member";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const castMembers = await db.castMember.findMany({
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
    return NextResponse.json(castMembers, { status: 200 });
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

  const validatedFields = castMemberSchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const { role, startDate, endDate, actorId } = validatedFields.data;

  if (!role) {
    return NextResponse.json({ error: "role is missing!" }, { status: 400 });
  }

  if (!startDate) {
    return NextResponse.json(
      { error: "startDate is missing!" },
      { status: 400 }
    );
  }

  if (!actorId) {
    return NextResponse.json({ error: "actorId is missing!" }, { status: 400 });
  }
  // console.log("herer");
  try {
    const castMember = await db.castMember.create({
      data: {
        role,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        actorId,
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

    return NextResponse.json(castMember, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
