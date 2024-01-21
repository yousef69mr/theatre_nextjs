import { cn } from "@/lib/utils";
import { Locale } from "@/next-i18next.config";
import { dir } from "i18next";
import { NavbarRoutes } from "./navbar-routes";
import { MobileSidebar } from "./mobile-sidebar";
import { HTMLAttributes } from "react";
import LanguageToggle from "@/components/helpers/language-toggle-button";

import UserButton from "@/components/auth/user-button";
import LoginButton from "@/components/auth/login-button";
import Logo from "@/components/helpers/logo";
import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { ThemeModeToggle } from "@/components/helpers/theme-button";

interface NavbarProps extends HTMLAttributes<HTMLElement> {
  locale: Locale;
  // styles?: CSSProperties;
}

const Navbar = async ({ locale, className }: NavbarProps) => {
  const user = await currentUser();

  const isSearchPage = false;

  return (
    <section
      className={cn(
        "flex w-full shadow-sm bg-red-100 dark:bg-red-700/15 backdrop-saturate-50 sticky top-0",
        className
      )}
    >
      <div className={cn("w-full flex flex-wrap items-center")}>
        <div
          className={cn(
            "flex gap-x-6"
            // dir(locale as string) === "rtl" && "flex-row-reverse"
          )}
        >
          <Link href={`/${locale}`}>
            <Logo />
          </Link>

          <NavbarRoutes className="gap-x-2" />

          {isSearchPage && (
            <div className="hidden md:block">{/* <SearchInput /> */}</div>
          )}
        </div>
        <div
          className={cn(
            "md:flex gap-x-2 flex-wrap hidden",
            dir(locale as string) === "ltr" ? " ml-auto" : " mr-auto"
          )}
        >
          <LanguageToggle />
          <ThemeModeToggle />
          {user ? (
            <UserButton />
          ) : (
            <LoginButton mode="redirect">Login</LoginButton>
          )}
        </div> 
      </div>
      <MobileSidebar locale={locale} />
    </section>
  );
};

export default Navbar;
