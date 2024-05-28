import { boolean, object, string } from "zod";

export const festivalSchema = object({
  name: string().min(1, { message: "name is required" }),
  imgUrl: string().optional().nullable(),
  description: string().optional(),
  isPublished: boolean().default(true),
});
