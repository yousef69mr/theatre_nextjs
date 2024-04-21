"use client";

import { Globe2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useNavigationStore } from "@/hooks/stores/use-navigation-store";

export const LocaleFlags: Record<string, string> = {
  ar: "eg",
  en: "gb",
  // de: "de",
};

export default function LanguageToggle() {
  const { i18n, t } = useTranslation("constants");
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();
  const isOpen = useNavigationStore((store) => store.isOpen);
  const onClose = useNavigationStore((store) => store.onClose);
  // const {lang:}=useParams()

  // console.log(currentLocale);

  const handleLocaleChange = (newLocale: Locale) => {
    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "; expires=" + date.toUTCString();
    document.cookie = `i18next=${newLocale};expires=${expires};path=/`;

    // redirect to the new locale path

    const segmanets = currentPathname.split("/");

    //change from any locale to default locale
    if (
      i18nConfig.locales.includes(segmanets[1]) &&
      newLocale !== segmanets[1]
    ) {
      const firstSlash = currentPathname.indexOf("/");
      // console.log(firstSlash);
      if (firstSlash !== -1) {
        // console.log(currentPathname);
        const secondSlash = currentPathname.indexOf("/", firstSlash + 1);
        if (secondSlash !== -1) {
          const newUrl = currentPathname.slice(secondSlash);

          // console.log(newUrl);

          if (newLocale !== i18nConfig.defaultLocale) {
            router.push(`/${newLocale}${newUrl}`);
          } else {
            router.push(newUrl);
          }
        } else {
          router.push(`/${newLocale}`);
        }
      } else {
        // console.log(newLocale);
        router.push(`/${newLocale}`);
      }

      //change from default locale to any different locale
    } else if (newLocale !== segmanets[1]) {
      router.push(`/${newLocale}${currentPathname}`);
    }

    router.refresh();

    if (isOpen) {
      onClose();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {/* <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    //           <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /> */}
          {currentLocale && i18nConfig.locales.includes(currentLocale) ? (
            <Image
              loading="lazy"
              className="object-contain"
              width={20}
              height={20}
              // style={{ margin: 2 }}
              src={`https://flagcdn.com/w20/${
                LocaleFlags[currentLocale.toLocaleLowerCase()]
              }.png`}
              // srcSet={`https://flagcdn.com/w40/${
              //   LocaleFlags[currentLocale.toLocaleLowerCase()]
              // }.png 2x`}
              alt={currentLocale.toLocaleLowerCase()}
            />
          ) : (
            <Globe2 className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">{t("navbar.localization.toggleText")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18nConfig.locales.map((locale) => {
          const localeCountryCode = LocaleFlags[locale.toLocaleLowerCase()];
          return (
            <DropdownMenuItem
              key={locale}
              className={cn(
                "flex items-center justify-end cursor-pointer",
                currentLocale === locale && "opacity-50 cursor-none "
              )}
              disabled={currentLocale === locale}
              onClick={() => handleLocaleChange(locale)}
            >
              <label className="cursor-pointer">
                {t(`navbar.localization.locales.${locale}`)}
              </label>
              {localeCountryCode && (
                <Image
                  loading="lazy"
                  width={20}
                  className="mx-1"
                  height={20}
                  // style={{ margin: 2 }}
                  src={`https://flagcdn.com/w20/${localeCountryCode.toLowerCase()}.png`}
                  // srcSet={`https://flagcdn.com/w40/${localeCountryCode.toLowerCase()}.png 2x`}
                  alt={locale.toLocaleLowerCase()}
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
