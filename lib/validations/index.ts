import { boolean, object } from "zod";

export const permisionsSchema = object({
  isPublished: boolean(),
});
