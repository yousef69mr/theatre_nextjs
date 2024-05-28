import { FacultyCast } from "@prisma/client";
import { boolean, object, string, enum as enum_ } from "zod";

export const executorSchema = object({
  name: string().min(1, { message: "name is required" }),
  nickname: string().optional(),
  description: string().optional(),
  imgUrl: string().optional().nullable(),
  facultyCast: enum_([
    FacultyCast.AGRICULTURE,
    FacultyCast.ARCHAEOLOGY,

    FacultyCast.LAW,
    FacultyCast.ENGINEERING,
    FacultyCast.MEDICINE,
    FacultyCast.SCIENCE,
    FacultyCast.PHARMACY,
    FacultyCast.COMMERCE,
    FacultyCast.ARTS,

    FacultyCast.DENTISTRY,
    FacultyCast.COMPUTERS,
    FacultyCast.EDUCATION,
    FacultyCast.ECONOMICS,

    FacultyCast.NURSING,
    FacultyCast.SPECIFIC_EDUCATION,
    FacultyCast.VETERINARY,
    FacultyCast.MASS,
    FacultyCast.CHILDHOOD,
    FacultyCast.DAR_ULOOM,
    FacultyCast.OTHER,
  ]),
  isPublished: boolean().default(true),
});
