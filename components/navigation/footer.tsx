"use client";

import { cn } from "@/lib/utils";
import { FC, HTMLAttributes } from "react";
import Logo from "@/components/helpers/logo";
import Link from "next/link";
import { Locale } from "@/next-i18next.config";
import { FaFacebookSquare } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { author } from "@/lib/constants";
import { SocalMediaType } from "@/types";

interface FooterProps extends HTMLAttributes<HTMLElement> {
  locale: Locale;
}
const Footer: FC<FooterProps> = (props) => {
  const { locale, className } = props;

  const { t } = useTranslation();

  const socalMedia: SocalMediaType[] = [];
  return (
    <footer className={cn("w-full min-h-14", className)}>
      <div className="flex w-full h-full flex-wrap gap-6 items-center justify-between border px-10 py-5 rounded-lg">
        <Link href={`/${locale}`}>
          <div className="flex items-center justify-center">
            <Logo />
          </div>
        </Link>
        <div className="flex flex-col justify-center items-center">
          <p className="text-sm md:text-lg">
            {t("messages.rights-preserved", {
              ns: "constants",
            })}
            <Link
              href={author.socialLink}
              target="_blank"
              className="capitalize text-primary hover:text-orange-300 hover:scale-125 font-semibold text-lg"
            >
              {author.name}
            </Link>
          </p>
          <p className="text-sm md:text-lg">© 2024</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {socalMedia.map((socal) => (
            <Link href={socal.href} key={socal.name}></Link>
          ))}
          {/* <FaFacebookSquare className="text-primary h-7 w-7" /> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
