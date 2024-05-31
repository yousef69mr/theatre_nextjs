"use client";

import { NewsCardType } from "@/types";

import { FC, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import NewsCard from "@/components/cards/news-card";
interface HomeCarouselProps {
  news: NewsCardType[];
}

const HomeCarousel: FC<HomeCarouselProps> = (props) => {
  const { news } = props;

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <Carousel
      opts={{
        active: true,
        loop: true,
        align: "center",
      }}
      plugins={[plugin.current]}
      //   className="w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-4xl xl:max-w-6xl"
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="flex rtl:flex-row-reverse">
        {news.map((item, index) => (
          <CarouselItem key={index} className="-ml-1 basis-full">
            <div className="p-1">
              <NewsCard news={item} className="w-full h-96" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default HomeCarousel;
