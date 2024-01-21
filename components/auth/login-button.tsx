"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const LoginButton = (props: LoginButtonProps) => {
  const { children, asChild, mode = "redirect" } = props;

  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };

  if (asChild) {
    if (mode === "modal") {
      return <span>{children}</span>;
    }
    return (
      <span onClick={onClick} className="cursor-pointer">
        {children}
      </span>
    );
    
  } else {
    if (mode === "modal") {
      return <span>{children}</span>;
    }
    return (
      <Button type="button" onClick={onClick} className="cursor-pointer">
        {children}
      </Button>
    );
  }
};

export default LoginButton;
