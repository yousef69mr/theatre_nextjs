"use client";

// import { UserButton, useAuth } from "@clerk/nextjs";
import { useParams, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
// import { isTeacher } from "@/lib/teacher";

// import { SearchInput } from "./search-input";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

// import { useEffect } from "react";

export const NavbarRoutes = (props: React.HTMLAttributes<HTMLElement>) => {
  const { className } = props;
  //   const { userId } = useAuth();
  // const user = useCurrentUser();
  const { t } = useTranslation();
  const pathname = usePathname();
  const params = useParams();

  const locale = params.locale;

  // useEffect(() => {
  //   alert(params.lang);
  // }, [params.lang]);

  const routes = [
    {
      href: `/${locale}/plays`,
      label: "Plays",
      active: pathname === `/${locale}/plays`,
    },
    {
      href: `/${locale}/attend-play`,
      label: "Attend Play",
      active: pathname === `/${locale}/attend-play`,
    },
  ];

  return (
    <nav
      className={cn(
        "md:flex items-center space-x-2 lg:space-x-6 hidden",
        className
      )}
    >
      {routes.map((route) => (
        <Link
          href={route.href}
          key={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};
