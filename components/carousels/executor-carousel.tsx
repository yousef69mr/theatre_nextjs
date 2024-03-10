import { ExecutorType } from "@/types";
import { FC } from "react";
import ExecutorCard from "@/components/cards/executors/executor-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ExecutorRole } from "@prisma/client";

interface ExecutorCarouselProps {
  executors: (ExecutorType & { role?: ExecutorRole })[];
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
      <CarouselContent>
        {executors.map((executor) => (
          <CarouselItem
            key={executor.id}
            className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <div className="p-1">
              <ExecutorCard
                executor={executor}
                role={executor.role}
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

export default ExecutorCarousel;
