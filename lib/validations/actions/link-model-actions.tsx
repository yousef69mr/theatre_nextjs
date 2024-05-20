import { ExecutorRole } from "@prisma/client";
import { array, object, string, enum as enum_, number } from "zod";

export const actorInPlaySchema = object({
  characterNames: array(
    string().min(1, { message: "character name is required" })
  ),
  imgUrl: string().optional().nullable(),
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
  position: number()
    .min(1, { message: "1 minimum" })
    .max(25, { message: "25 maximum" })
    .optional(),
  seatsLimit: number().min(0, { message: "0 minimum" }),
  guestTicketLimit: number().min(0, { message: "0 minimum" }).optional(),
  actorTicketLimit: number().min(0, { message: "0 minimum" }).optional(),
  showTimes: array(string()),
});

export const userActorLinkSchema = object({
  actorId: string().min(1, { message: "actorId is required" }),
  userId: string().min(1, { message: "userId is required" }),
});

export const userExecutorLinkSchema = object({
  executorId: string().min(1, { message: "executorId is required" }),
  userId: string().min(1, { message: "userId is required" }),
});
