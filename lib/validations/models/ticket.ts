import { object, string } from "zod";

export const ticketSchema = object({
  guestName: string().min(1, { message: "guest name is required" }),
  festivalId: string().min(1, { message: "festivalId is required" }),
  playId: string().min(1, { message: "playId is required" }),
  showTime: string().min(1, { message: "showTime is required" }),
});
