import { boolean, object } from "zod";

export const ticketSchema = object({});

export const bookPlayTicketSchema = object({});

export const permisionsSchema = object({
  isPublished: boolean(),
});
