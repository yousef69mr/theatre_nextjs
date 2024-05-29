import dynamic from "next/dynamic";
// import { Logo } from "./logo";
import Link from "next/link";
import { dir } from "i18next";
// import { LanguageProps } from "@/types";
import { cn } from "@/lib/utils";
// import { useLanguageStore } from "@/hooks/use-language-store";
import { Locale } from "@/next-i18next.config";

import Logo from "@/components/helpers/logo";
import { NavbarRoutes } from "./navbar-routes";
import { FC } from "react";

import { ThemeModeToggle } from "@/components/helpers/theme-button";
import LanguageToggle from "@/components/helpers/language-toggle-button";
// import UserButton from "@/components/auth/user-button";
import LoginButton from "@/components/auth/login-button";
import { useCurrentUser } from "@/hooks/use-current-user";
import LogoutButton from "@/components/auth/logout-button";

const UserButton = dynamic(() => import("@/components/auth/user-button"), {
  ssr: false,
});

interface SidebarProps {
  locale: Locale;
}
export const Sidebar: FC<SidebarProps> = ({ locale }) => {
  const user = useCurrentUser();
  return (
    <div
      className={cn(
        "h-full flex flex-col overflow-y-auto shadow-sm",
        dir(locale as Locale) === "ltr" ? "border-r" : "border-l items-end"
      )}
    >
      <Link href={`/${locale}`}>
        <div className="p-6">
          <Logo />
        </div>
      </Link>
      <div className="flex flex-col w-full flex-1 items-center justify-center ">
        <NavbarRoutes
          className="h-full justify-center gap-y-3 flex flex-col space-y-2 lg:space-y-6"
          loggedUserRole={user?.role}
        />
      </div>

      <div
        className={cn(
          "md:hidden gap-x-2 flex-wrap flex flex-1 gap-y-3  flex-col w-full items-center justify-center"
          // dir(locale as string) === "ltr" ? " ml-auto" : " mr-auto"
        )}
      >
        <LanguageToggle />
        <ThemeModeToggle />
        {user ? (
          <div
            className={cn(
              "w-full flex justify-around",
              // dir(locale as Locale) === "rtl" && "flex-row-reverse"
            )}
          >
            <UserButton />
            <LogoutButton size="icon" />
          </div>
        ) : (
          <LoginButton mode="redirect" />
        )}
      </div>
    </div>
  );
};
