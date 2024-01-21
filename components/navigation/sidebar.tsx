"use client";

// import { Logo } from "./logo";
import Link from "next/link";
import { SidebarRoutes } from "./sidebar-routes";
import { dir } from "i18next";
// import { LanguageProps } from "@/types";
import { cn } from "@/lib/utils";
// import { useLanguageStore } from "@/hooks/use-language-store";
import { Locale } from "@/next-i18next.config";
import { useParams } from "next/navigation";
import Logo from "../helpers/logo";

export const Sidebar = () => {
  const { lang } = useParams();
  return (
    <div
      className={cn(
        "h-full flex flex-col overflow-y-auto bg-white shadow-sm",
        dir(lang as Locale) === "ltr" ? "border-r" : "border-l"
      )}
    >
      <Link href={'/'}>
        <div className="p-6">
          <Logo />
        </div>
      </Link>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
