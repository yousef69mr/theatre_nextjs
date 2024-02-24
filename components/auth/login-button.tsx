"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useNavigationStore } from "@/hooks/stores/use-navigation-store";
import { useTranslation } from "react-i18next";

interface LoginButtonProps {
  children?: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const LoginButton = (props: LoginButtonProps) => {
  const { children, asChild, mode = "redirect" } = props;
  const { t } = useTranslation();

  const router = useRouter();

  const isOpen = useNavigationStore((store) => store.isOpen);
  const onClose = useNavigationStore((store) => store.onClose);

  const onClick = () => {
    router.push("/auth/login");
    if (isOpen) {
      onClose();
    }
  };

  const btnText = children ? children : t("common:login");

  if (asChild) {
    if (mode === "modal") {
      return <span>// Not Implemented</span>;
    }

    return (
      <span onClick={onClick} className="cursor-pointer">
        {btnText}
      </span>
    );
  }
  if (mode === "modal") {
    return <Button>// Not Implemented</Button>;
  }

  return (
    <Button type="button" onClick={onClick} className="cursor-pointer">
      {btnText}
    </Button>
  );
};

export default LoginButton;
