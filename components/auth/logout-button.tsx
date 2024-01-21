"use client";

import { logout } from "@/lib/actions/logout";

interface LoginButtonProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const LoginButton = (props: LoginButtonProps) => {
  const { children, asChild } = props;

  const onClick = () => {
    logout();
  };

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginButton;
