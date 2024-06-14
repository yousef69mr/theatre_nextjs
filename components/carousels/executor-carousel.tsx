import { ExecutorCardType, } from "@/types";
import { FC } from "react";
import ExecutorCard from "@/components/cards/executors/executor-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ExecutorCarouselProps {
  executors: ExecutorCardType[];
}
const ExecutorCarousel: FC<ExecutorCarouselProps> = (props) => {
  const { executors } = props;

  return (
    <Carousel
      opts={{
        active: true,
      }}
      className="w-full"
    >
      <CarouselContent className="flex rtl:flex-row-reverse">
        {executors.map((executor) => (
          <CarouselItem
            key={executor.id}
            className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <div className="p-1">
              <ExecutorCard
                executor={executor}
                className="w-full h-80"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:block" />
      <CarouselNext className="hidden md:block" />
    </Carousel>
  );
};

export default ExecutorCarousel;
