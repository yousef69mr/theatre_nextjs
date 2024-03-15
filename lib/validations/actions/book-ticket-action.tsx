import { array, object, string } from "zod";

export const bookPlayTicketsSchema = object({
  guestNames: array(string().min(1, { message: "guest name is required" })),
  playId: string().min(1, { message: "playId is required" }),
  festivalId: string().min(1, { message: "festivalId is required" }),
  showTime: string(),
});
