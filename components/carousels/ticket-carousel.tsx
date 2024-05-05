import { TicketType } from "@/types";
import { FC } from "react";
import TicketCard from "@/components/cards/tickets/ticket-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
interface TicketCarouselProps {
  tickets: TicketType[];
  mode?: "page" | "modal";
}
const TicketCarousel: FC<TicketCarouselProps> = (props) => {
  const { tickets, mode = "page" } = props;
  return (
    <Carousel
      opts={{
        active: true,
      }}
      //   className="w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-4xl xl:max-w-6xl"
      className="w-full"
    >
      <CarouselContent className="flex rtl:flex-row-reverse">
        {tickets.map((ticket) => (
          <CarouselItem
            key={ticket.id}
            className={cn(
              "-ml-1 basis-full",
              mode === "page" && "md:basis-1/2 lg:basis-1/3"
            )}
          >
            <div className="p-1">
              <TicketCard
                ticket={ticket}
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

export default TicketCarousel;
