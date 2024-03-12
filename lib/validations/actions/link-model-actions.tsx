import { executorRoles } from "@/lib/auth";
import { ExecutorRole } from "@prisma/client";
import { array, object, string, enum as enum_ } from "zod";

export const actorInPlaySchema = object({
  characterNames: array(
    string().min(1, { message: "character name is required" })
  ),
  actorId: string().min(1, { message: "actorId is required" }),
  playId: string().min(1, { message: "playId is required" }),
  festivalId: string().min(1, { message: "festivalId is required" }),
});

export const executorInPlaySchema = object({
  executorId: string().min(1, { message: "executorId is required" }),
  playId: string().min(1, { message: "playId is required" }),
  festivalId: string().min(1, { message: "festivalId is required" }),
  role: enum_([
    ExecutorRole.DIRECTOR,
    ExecutorRole.AUTHOR,
    ExecutorRole.EXECUTIVE_DIRECTOR,
    ExecutorRole.CO_DIRECTOR,
    ExecutorRole.ACTING_COACH,
    ExecutorRole.ADVERTISING,
    ExecutorRole.MUSIC_EXECUTION,
    ExecutorRole.SOUND_DESIGNER,
    ExecutorRole.LIGHTING_DESIGNER,
    ExecutorRole.ASSISTANT_DIRECTOR,
    ExecutorRole.DECOR_DESIGNER,
    ExecutorRole.CAMERA_MAN,
    ExecutorRole.COSMATICS_DESIGNER,
    ExecutorRole.COSTUME_DESIGNER,
    ExecutorRole.OTHER,
  ]),
});

export const festivalPlaySchema = object({
  playId: string().min(1, { message: "playId is required" }),
  festivalId: string().min(1, { message: "festivalId is required" }),
  showTimes: array(string()),
});
