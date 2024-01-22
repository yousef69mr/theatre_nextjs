import { cn } from "@/lib/utils";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { FC } from "react";
interface PlaysPageProps {
  params: {
    locale: Locale;
  };
}

// export async function generateStaticParams() {
//   // const posts = await fetch('https://.../posts').then((res) => res.json())
 
//   return[]
// }

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}


const PlaysPage: FC<PlaysPageProps> = (props) => {
  return <main className={cn("w-full general-padding")}>PlaysPage</main>;
};

export default PlaysPage;
