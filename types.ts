import { Locale } from "./next-i18next.config";
import { ReactElement } from "react";

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
