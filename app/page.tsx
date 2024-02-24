"use client";

// import { ServerTranslation } from "@/lib/i18n";
import i18nConfig, { Locale, isValidLocale } from "@/next-i18next.config";
// import { cookies } from "next/headers";

import { redirect } from "next/navigation";
import { useTranslation } from "react-i18next";

const Page = () => {
  // const cookieStore = cookies();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.changeLanguage || null;
  // const params = useParams()
  // if (currentLanguage && isValidLocale(currentLanguage as unknown as Locale)) {
  //   return redirect(`/${currentLanguage}/dashboard`);
  // }
  // console.log(currentLanguage);
  //   console.log("home");
  if (!isValidLocale(currentLanguage?.toString())) {
    // const cookieStore = cookies();
    // const currentLanguage = cookieStore.get("i18next") || null;
  

    // console.log(currentLanguage)
    // if (currentLanguage && isValidLocale(currentLanguage.value)) {
    //   return redirect(`/${currentLanguage.value}`);
    // }

    return redirect(`/${i18nConfig.defaultLocale}`);
  }
  return redirect(`/${currentLanguage?.toString()}`);
};

export default Page;
