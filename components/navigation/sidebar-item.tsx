"use client";

import { LucideIcon } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { dir } from "i18next";
import { Locale } from "@/next-i18next.config";
// import { i18n } from "next-i18next";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const locale = params.lang;

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    href?.endsWith(pathname);

  // console.log(locale,dir(locale as Locale));
  // console.log(pathname);
  // console.log(`${href}/`);
  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "w-full flex items-center gap-x-2 text-slate-500 text-sm font-[500] transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700",
        dir(locale as Locale) === "ltr" ? "pl-6" : "pr-6 flex-row-reverse"
      )}
    >
      <div className={cn("flex items-center gap-x-2 py-4",dir(locale as Locale) === "rtl" && "flex-row-reverse")}>
        <Icon
          size={22}
          className={cn("text-slate-500", isActive && "text-sky-700")}
        />
        {label}
      </div>
      <div
        className={cn(
          "opacity-0 border-2 border-sky-700 h-full transition-all",
          isActive && "opacity-100",
          dir(locale as Locale) === "ltr" ? "ml-auto" : "mr-auto"
        )}
      />
    </button>
  );
};
