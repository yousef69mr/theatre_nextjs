"use client";

import { logout } from "@/lib/actions/logout";
import { Button } from "@/components/ui/button";
import { logoutRequest } from "@/lib/api-calls/auth/logout";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { LogOutIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Locale } from "@/next-i18next.config";
import { dir } from "i18next";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { HTMLAttributes } from "react";
// import { logoutRequest } from "@/lib/api-calls/logout";
// import toast from "react-hot-toast";

interface LogoutButtonProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  asChild?: boolean;
  size?: "icon";
}

const LogoutButton = (props: LogoutButtonProps) => {
  const { children, asChild, className, size } = props;
  const { t } = useTranslation();
  const { locale } = useParams();

  const onClick = () => {
    logout();
    // logoutRequest()
    //   .then((response) => response.data)
    //   .then(()=>window.location.reload())
    //   .catch((error) => toast.error(error as string));
  };

  const btnText = children ? children : t("common:logout");

  if (asChild) {
    if (size === "icon") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="rounded-full" asChild>
              <span
                onClick={onClick}
                className={cn(
                  "cursor-pointer text-destructive dark:text-red-500",
                  className
                )}
              >
                <LogOutIcon className="h-5 w-5" />
              </span>
            </TooltipTrigger>
            <TooltipContent>{btnText}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return (
      <span
        onClick={onClick}
        className={cn(
          "cursor-pointer text-destructive dark:text-red-500",
          className
        )}
      >
        {btnText}
      </span>
    );
  }

  if (size === "icon") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="rounded-full" asChild>
            <Button
              onClick={onClick}
              className={cn(
                "cursor-pointer text-destructive dark:text-red-500",
                className
              )}
              variant="ghost"
            >
              <LogOutIcon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{btnText}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      onClick={onClick}
      className={cn(
        "cursor-pointer text-destructive dark:text-red-500",
        className
      )}
      variant={"ghost"}
    >
      {btnText}
    </Button>
  );
};

export default LogoutButton;
