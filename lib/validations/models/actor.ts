import { FacultyCast } from "@prisma/client";
// import { FacultyCast } from "@prisma/client";
import { boolean, object, string, enum as enum_ } from "zod";

export const actorSchema = object({
  name: string().min(1, { message: "name is required" }),
  nickname: string().optional(),
  imgUrl: string().optional().nullable(),
  startDate: string().min(1, { message: "start date is required" }),
  endDate: string().optional(),
  description: string().optional(),
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
  isCastMember: boolean().default(true),
  isPublished: boolean().default(true),
});
