import { ActorCardType } from "@/types";
import { FC } from "react";
import ActorCard from "@/components/cards/actors/actor-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
interface ActorCarouselProps {
  actors: ActorCardType[];
}

const ActorCarousel: FC<ActorCarouselProps> = (props) => {
  const { actors } = props;

  // const uniqueActors = actors.
  return (
    <Carousel
      opts={{
        active: true,
      }}
      className="w-full"
    >
      <CarouselContent className="flex rtl:flex-row-reverse">
        {actors.map((actor) => (
          <CarouselItem
            key={actor.id}
            className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <div className="p-1">
              <ActorCard
                actor={actor}
                className="w-full h-80 md:w-full md:h-80"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ActorCarousel;
