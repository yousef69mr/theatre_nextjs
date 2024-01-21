"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { TranslatedRoute } from "@/types";

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const params = useParams();
  const { t } = useTranslation();
  const guestRoutes = [
    {
      id: 1,
      icon: Layout,
      href: `/${params.lang}/dashboard`,
    },
    {
      id: 2,
      icon: Compass,
      href: `/${params.lang}/search`,
    },
  ];

  const translatedGuestRoutes: TranslatedRoute[] = t(
    "sidebarRoutes.guestRoutes",
    {
      returnObjects: true,
    }
  );

  const teacherRoutes = [
    {
      id: 1,
      icon: List,
      label: "Courses",
      href: `/${params.lang}/teacher/courses`,
    },
    {
      id: 2,
      icon: BarChart,
      label: "Analytics",
      href: `/${params.lang}/teacher/analytics`,
    },
  ];

  const translatedTeacherRoutes: TranslatedRoute[] = t(
    "sidebarRoutes.teacherRoutes",
    {
      returnObjects: true,
    }
  );
  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;
  const translatedRoutes = isTeacherPage
    ? translatedTeacherRoutes
    : translatedGuestRoutes;

  console.log(translatedRoutes);
  return (
    <div className={cn("flex flex-col w-full")}>
      {routes.map((route) => {
        // const path = translatedRoutes?.find(
        //   (path) => path.id === route.id
        // );
        return (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={""||""}
            href={route.href}
          />
        );
      })}
    </div>
  );
};
