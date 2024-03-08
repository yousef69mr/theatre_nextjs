import { currentRole, isAdmin } from "@/lib/auth";
import { db } from "@/lib/database";
import { executorSchema } from "@/lib/validations/models/executor";

import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface ActorExecutorLinkProps {
  searchParams: {
    actorId?: string;
    executorId?: string;
  };
}

export async function GET(request: NextRequest, props: ActorExecutorLinkProps) {
  const {
    searchParams: { actorId, executorId },
  } = props;

  try {
    if (actorId) {
      const actor = await db.actor.findUnique({
        where: {
          id: actorId,
        },
      });

      if (!actor) {
        return NextResponse.json({ error: "not found" }, { status: 200 });
      }

      NextResponse.json(
        { ...actor, numOfViews: actor.numOfViews.toString() },
        { status: 200 }
      );
    }
    if (executorId) {
      const executor = await db.executor.findUnique({
        where: {
          id: executorId,
        },
      });

      if (!executor) {
        return NextResponse.json({ error: "not found" }, { status: 200 });
      }

      NextResponse.json(
        { ...executor, numOfViews: executor.numOfViews.toString() },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { error: "invalid searchParams" },
      { status: 400 }
    );
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

  const validatedFields = executorSchema.safeParse(values);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  // console.log("herer");
  try {
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
