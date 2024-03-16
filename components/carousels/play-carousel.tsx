import { PlayType } from "@/types";
import { FC } from "react";
import PlayCard from "@/components/cards/plays/play-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
interface PlayCarouselProps {
  plays: PlayType[];
}
const PlayCarousel: FC<PlayCarouselProps> = (props) => {
  const { plays } = props;
  return (
    <Carousel
      opts={{
        active: true,
      }}
      //   className="w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-4xl xl:max-w-6xl"
      className="w-full"
    >
      <CarouselContent className="flex rtl:flex-row-reverse">
        {plays.map((play) => (
          <CarouselItem
            key={play.id}
            className="-ml-1 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <div className="p-1">
              <PlayCard play={play} className="w-full h-80 md:w-full md:h-80" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default PlayCarousel;
