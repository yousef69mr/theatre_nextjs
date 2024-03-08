import { boolean, date, object, string } from "zod";

export const actorSchema = object({
  name: string().min(1, { message: "name is required" }),
  nickname: string().optional(),
  imgUrl: string(),
  startDate: string().min(1, { message: "start date is required" }),
  endDate: string().optional(),
  description: string().optional(),
  isCastMember: boolean().default(true),
  isPublished: boolean().default(true),
});
