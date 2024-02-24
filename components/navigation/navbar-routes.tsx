"use client";

// import { UserButton, useAuth } from "@clerk/nextjs";
import { useParams, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

// import { isTeacher } from "@/lib/teacher";

// import { SearchInput } from "./search-input";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { FC, Fragment, HTMLAttributes } from "react";
import { useNavigationStore } from "@/hooks/stores/use-navigation-store";

import { isAdmin } from "@/lib/auth";
import { UserRole } from "@prisma/client";

// import { useEffect } from "react";
interface NavbarRoutesProps extends HTMLAttributes<HTMLElement> {
  loggedUserRole?: string;
}
export const NavbarRoutes: FC<NavbarRoutesProps> = (props) => {
  const { className, loggedUserRole } = props;
  //   const { userId } = useAuth();
  // const user = useCurrentUser();
  const { t } = useTranslation();
  const pathname = usePathname();
  const params = useParams();

  const locale = params.locale;

  const onClose = useNavigationStore((store) => store.onClose);

  const routes = [
    {
      href: `/${locale}/admin/dashboard`,
      label: t("navbar.routes.adminDashboard"),
      isHidden: !isAdmin(loggedUserRole as UserRole),
      active: pathname.startsWith(`/${locale}/admin`),
    },
    {
      href: `/${locale}/plays`,
      label: t("navbar.routes.plays"),
      active: pathname === `/${locale}/plays`,
    },
    {
      href: `/${locale}/actors`,
      label: t("navbar.routes.actors"),
      active: pathname === `/${locale}/actors`,
    },
    {
      href: `/${locale}/attend-play`,
      label: t("navbar.routes.bookPlayTicket"),
      active: pathname === `/${locale}/attend-play`,
    },
  ];

  return (
    <nav
      className={cn(
        "items-center",
        // !isOpen && "space-x-2 lg:space-x-6",
        // isOpen && "flex flex-col gap-y-2 space-y-2 lg:space-y-6",
        className
      )}
    >
      {routes.map((route) => (
        <Fragment key={route.href}>
          {!route.isHidden && (
            <Link
              href={route.href}
              onClick={() => onClose()}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                route.active ? " text-primary" : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
};
