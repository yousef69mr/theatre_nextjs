import { array, boolean, date, object, string } from "zod";

export const playSchema = object({
  name: string().min(1, { message: "name is required" }),
  festivalId: string().min(1, { message: "festivalId is required" }),
  executorId: string().min(1, { message: "festivalId is required" }),
  showTime: date(),
  videoUrl: string().nullable().optional(),
  description: string().optional(),
  posterImgUrl: string().min(1, { message: "posterImgUrl is required" }),
  images: array(
    string().min(1, { message: "image url is required" })
  ).optional(),
  isPublished: boolean().default(true),
});
