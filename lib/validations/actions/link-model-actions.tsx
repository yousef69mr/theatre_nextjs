import { array, date, object, string } from "zod";

export const actorInPlaySchema = object({
  actorId: string().min(1, { message: "actorId is required" }),
  playId: string().min(1, { message: "playId is required" }),
  festivalId: string().min(1, { message: "festivalId is required" }),
});

export const festivalPlaySchema = object({
  playId: string().min(1, { message: "playId is required" }),
  festivalId: string().min(1, { message: "festivalId is required" }),
  showTimes: array(string()),
});
