import { UserRole } from "@prisma/client";
import { object, string, enum as enum_, array } from "zod";

export const castMemberSchema = object({
  actorId: string().min(1, { message: "actorId is required" }),
  timeIntervals: array(
    object({
      startDate: string().min(1, { message: "start date is required" }),
      endDate: string().optional().nullable(),
    })
  ),
  role: enum_([
    UserRole.ACTOR,
    UserRole.CAST_HEAD,
    UserRole.CAST_VICE_PRESIDENT,
    // UserRole.ADMIN,
    // UserRole.USER,
  ]),
});
