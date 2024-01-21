import { cn } from "@/lib/utils";
import React from "react";

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header = (props: HeaderProps) => {
  const { title, subtitle } = props;
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      {title && <h1 className={cn("text-3xl font-semibold")}>{title}</h1>}
      {subtitle && (
        <p className=" dark:text-red-100 text-red-700  text-sm font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Header;
