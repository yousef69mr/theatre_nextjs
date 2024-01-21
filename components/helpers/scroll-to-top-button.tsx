"use client";

import { ChevronUp } from "lucide-react";
import ScrollToTop from "react-scroll-to-top";

interface Props {
  top?: number;
}

const ScrollToTopButton = (props: Props) => {
  const { top } = props;
  return (
    <ScrollToTop
      smooth
      top={top}
      component={<ChevronUp className="h-6 w-6" />}
      className="flex items-center justify-center !bg-primary !text-primary-foreground hover:!bg-primary/90 !bottom-20 right-10"
    />
  );
};

export default ScrollToTopButton;
