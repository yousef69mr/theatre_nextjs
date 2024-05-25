import { ExecutorRole, type MediaEnum, UserRole } from "@prisma/client";
import { Locale } from "./next-i18next.config";
import { ReactElement } from "react";
import { actorRoles } from "@/lib/auth";
import { facultyCasts } from "@/lib/constants";

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

export type UserType = {
  id: string;
  name: string;
  email: string;
  password?: String | null;
  emailVerified?: Date | null;
  role: UserRole;
  image: string | null;
  isTwoFactorEnabled: boolean;
  isEditable: boolean;
  actor?: UserActorLinkType | null;
  executor?: UserExecutorLinkType | null;
  tickets: TicketType[];
  updatedAt: Date;
  createdAt: Date;
};
//////////////////////////////////////////////////

//models
export type ActorInPlayType = {
  id: string;
  characterNames: string[];
  imgUrl?: string | null;
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
  tickets: TicketType[];
  mediae?: MediaType[];
};

export type PlayFestivalType = {
  id: string;
  position?: number;
  seatsLimit: number;
  guestTicketLimit: number;
  actorTicketLimit: number;
  showTimes: string[];
  images: string[];
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
  facultyCast: (typeof facultyCasts)[number];
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
  facultyCast: (typeof facultyCasts)[number];
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
  posterImgUrl?: string;
  director?: ExecutorType;
  numOfViews: string;
  festivals: PlayFestivalType[];
  actors: ActorInPlayType[];
  awards: AwardType[];
  executors: ExecutorInPlayType[];
  mediae?: MediaType[];
  tickets: TicketType[];
  isPublished: boolean;
};

export type TicketType = {
  id: string;
  guestName: string;
  showTime: string;
  seatNumber: number;
  price: number;
  userId?: string | null;
  play: PlayType;
  festival: FestivalType;
  isScanned: Boolean;
};

//////////////////////////////////////

export type UserActorLinkType = {
  id: string;
  actor: ActorType;
  user: UserType;
};

export type UserExecutorLinkType = {
  id: string;
  executor: ExecutorType;
  user: UserType;
};
////////////////////////////////////////

export type ActorCardType = ActorType & {
  images: string[];
  characterNames: string[];
  festivals: ActorInPlayType[];
};

export type PlayCardType = PlayType;

export type ExecutorCardType = ExecutorType & {
  roles: string[];
  festivals: ExecutorInPlayType[];
};

export type TicketCardType = TicketType;

////////////////////////////////////////

export type MediaType = {
  id: string;
  mediaUrl: string;
  type: MediaEnum;
  play?: PlayType;
  festival?: FestivalType;
  actors: ActorMediaType[];
  isPublished: boolean;
};

export type ActorMediaType = {
  id: string;
  actor: ActorType;
  media: MediaType;
};
////////////////////////////////////////.
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
