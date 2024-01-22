"use client";

import { logout } from "@/lib/actions/logout";
import { Button } from "@/components/ui/button";
// import { logoutRequest } from "@/lib/api-calls/logout";
// import toast from "react-hot-toast";

interface LogoutButtonProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const LogoutButton = (props: LogoutButtonProps) => {
  const { children, asChild } = props;

  const onClick = () => {
    logout();
    // logoutRequest()
    //   .then((response) => response.data)
    //   .then(()=>window.location.reload())
    //   .catch((error) => toast.error(error as string));
  };

  if (asChild) {
    return (
      <span onClick={onClick} className="cursor-pointer">
        {children}
      </span>
    );
  }
  return (
    <Button onClick={onClick} className="cursor-pointer">
      {children}
    </Button>
  );
};

export default LogoutButton;
