import { ExecutorRole, type UserRole } from "@prisma/client";
import { Locale } from "./next-i18next.config";
import { ReactElement } from "react";
import { actorRoles } from "@/lib/auth";

export type DataTransationModeType = "serverAction" | "api";

export type LanguageParamsProps = {
  params: {
    locale: Locale;
  };
};

export type Route = TranslatedRoute & {
  icon: ReactElement;
  href: string;
};

export type TranslatedRoute = {
  id: number;
  label: string;
};

/////////////////////////////////////////

//auth types
export type VerificationTokenType = {
  email: string;
  token: string;
  expires: Date;
};

export type PasswordRestTokenType = {
  email: string;
  token: string;
  expires: Date;
};

export type TwoFactorTokenType = {
  email: string;
  token: string;
  expires: Date;
};

export type TwoFactorConfirmationType = {
  userId: string;
};

//////////////////////////////////////////////////

//models
export type ActorInPlayType = {
  id: string;
  characterNames: string[];
  actor: ActorType;
  play: PlayType;
  festival: FestivalType;
};

export type AwardType = {
  id: string;
  name: string;
  postion: string;
  acquisitionDate: Date;
  play: PlayType;
  winner: ActorType | ExecutorType;
  festival: FestivalType;
};

export type FestivalType = {
  id: string;
  imgUrl?: string;
  name: string;
  awards: AwardType[];
  plays: PlayFestivalType[];
  actors: ActorInPlayType[];
  executors: ExecutorInPlayType[];
};

export type PlayFestivalType = {
  id: string;
  position?: number;
  showTimes: string[];
  play: PlayType;
  festival: FestivalType;
};

export type CastMemberType = {
  id: string;
  startDate: string;
  endDate?: string;
  actor: ActorType;
  role: (typeof actorRoles)[number];
};

export type ActorType = {
  id: string;
  name: string;
  description?: string;
  nickname?: string;
  imgUrl: string;
  executor?: ExecutorType | null;
  castMembers: CastMemberType[];
  userId?: string;
  numOfViews: string;
  plays: ActorInPlayType[];
  awards: AwardType[];
  isPublished: boolean;
};

export type ExecutorType = {
  id: string;
  name: string;
  description?: string;
  nickname?: string;
  imgUrl?: string;
  userId?: string;
  numOfViews: string;
  actor?: ActorType | null;
  // role: ExecutorRole;
  plays: ExecutorInPlayType[];
  awards: AwardType[];
  isPublished: boolean;
};

export type ExecutorInPlayType = {
  id: string;
  role: ExecutorRole;
  play: PlayType;
  executor: ExecutorType;
  festival: FestivalType;
};

export type PlayType = {
  id: string;
  name: string;
  description?: string;
  videoUrl?: string;
  posterImgUrl: string;
  director?: ExecutorType;
  images: string[];
  numOfViews: string;
  festivals: PlayFestivalType[];
  actors: ActorInPlayType[];
  awards: AwardType[];
  executors: ExecutorInPlayType[];
  isPublished: boolean;
};

////////////////////////////////////////
export type adminRouteType = {
  id: number;
  href: string;
  label: string;
};

export type SelectType = {
  id?: number;
  value: string;
  label: string;
};
