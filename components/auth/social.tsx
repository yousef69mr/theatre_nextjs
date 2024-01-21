"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DEFAULT_LOGIN_REDIRCT } from "@/routes";

const socials = [
  { label: "google", icon: FcGoogle },
  { label: "github", icon: FaGithub },
];

type providerType = "google" | "github";

const Social = () => {
  const onClick = (provider: providerType) => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRCT,
    });
  };
  return (
    <div className="flex items-center w-full gap-x-2">
      <TooltipProvider>
        {socials.map((social) => (
          <Tooltip key={social.label}>
            <TooltipTrigger asChild>
              <Button
                className="w-full bg-transparent hover:bg-red-200"
                variant={"outline"}
                size={"lg"}
                onClick={() => onClick(social.label as providerType)}
              >
                {<social.icon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{social.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default Social;
