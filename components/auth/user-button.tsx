"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { FaUser } from "react-icons/fa";

import { LogOutIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LogoutButton from "./logout-button";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { dir } from "i18next";
import { Locale } from "@/next-i18next.config";
import { cn } from "@/lib/utils";

const UserButton = () => {
  const user = useCurrentUser();
  const { locale } = useParams();
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="rounded-full" asChild>
              <Avatar>
                <AvatarImage
                  src={user?.image || ""}
                  srcSet={user?.image || ""}
                />
                <AvatarFallback className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600 to-red-800 w-full flex items-center justify-center">
                  <FaUser className="text-white" />
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col items-start">
                <p>{user?.email}</p>
                <p className="text-muted-foreground">{user?.name}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40 hidden md:flex"
        align={dir(locale as Locale) === "ltr" ? "end" : "start"}
      >
        <LogoutButton className="w-full" asChild>
          <DropdownMenuItem
            className={cn(
              "flex cursor-pointer",
              dir(locale as Locale) === "rtl" && "flex-row-reverse"
            )}
          >
            <LogOutIcon
              className={cn(
                "h-4 w-4",
                dir(locale as Locale) === "rtl" ? "ml-2" : " mr-2"
              )}
            />
            {t("logout", { ns: "constants" })}
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
