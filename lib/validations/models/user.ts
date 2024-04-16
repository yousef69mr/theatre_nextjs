import { UserRole } from "@prisma/client";
import { object, string, enum as enum_, optional } from "zod";

export const userSchema = object({
  email: string().email({ message: "Email is required" }),
  name: string().min(1, { message: "Name is required" }),
  password: optional(string().min(6)),
  role: enum_([
    UserRole.ACTOR,
    UserRole.ADMIN,
    UserRole.CAST_HEAD,
    UserRole.CAST_VICE_PRESIDENT,
    UserRole.USER,
  ]),
});
