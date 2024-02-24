"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const ErrorPage = () => {
  const router = useRouter();
  return (
    <div className="w-full h-screen flex items-center justify-center">
      error
      <Button onClick={(e) => router.push("/")}>{"home"}</Button>
    </div>
  );
};

export default ErrorPage;
