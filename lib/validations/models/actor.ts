import { boolean, object, string } from "zod";

export const actorSchema = object({
  name: string().min(1, { message: "name is required" }),
  nickname: string().optional(),
  imgUrl: string().optional(),
  isPublished: boolean().default(true),
});
