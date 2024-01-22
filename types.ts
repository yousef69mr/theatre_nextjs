import { Locale } from "./next-i18next.config";
import { ReactElement } from "react";

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
export type ShowTimeType = {
  showTime: Date;
  play: PlayType;
  festivalId: string;
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
  description?: string;
  awards: AwardType[];
};

export type ActorType = {
  id: string;
  name: string;
  imgUrl: string;
  userId?: string;
  plays: PlayType[];
  awards: AwardType[];
};

export type ExecutorType = {
  id: string;
  name: string;
  executorTitle: string;
  imgUrl: string;
  userId?: string;
  plays: PlayType[];
  awards: AwardType[];
};

export type PlayType = {
  id: string;
  name: string;
  videoUrl: string;
  imgUrl: string;
  images: string[];

  showTimes: ShowTimeType[];
  actors: ActorType[];
};
