"use client";

import { TicketType } from "@/types";
import { FC, useEffect } from "react";
import TicketCard from "./ticket-card";
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  // PaginationEllipsis,
  PaginationItem,
  // PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
// import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
// import { Separator } from "@/components/ui/separator";
interface TicketListProps {
  tickets: TicketType[];
  mode?: "page" | "modal";
}

const CARDS_PER_PAGE = 6;

const TicketList: FC<TicketListProps> = (props) => {
  const { tickets, mode = "page" } = props;
  const searchKey = "ticketPage";
  const {
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    getCurrentPageData,
  } = usePagination(CARDS_PER_PAGE, searchKey, tickets);

  // const params = useParams();

  // const locale = params.locale;

  const cardMode = mode === "page" ? "details" : "abstract";
  return (
    <section className="w-full flex flex-col">
      {/**TODO: filter plays */}
      <div
        className={cn(
          "w-full gap-6 mt-2",
          mode === "page" && "grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3",
          mode === "modal" && "flex items-center justify-center gap-2"
        )}
      >
        {getCurrentPageData().map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            className={cn(
              "w-full",
              mode === "modal" && "flex-1"
            )}
            mode={cardMode}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => previousPage()}
                disabled={currentPage === 0}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                {/* <PaginationLink
                href={`${pathname}?${searchKey}=${index + 1}`}
                className={cn(index === currentPage && "bg-primary text-white")}
              >
                {index + 1}
              </PaginationLink> */}

                <PaginationButton
                  onClick={() => goToPage(index)}
                  // className={cn(index === currentPage && "bg-primary text-white")}
                  isActive={index === currentPage}
                >
                  {index + 1}
                </PaginationButton>
              </PaginationItem>
            ))}
            {/* <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem> */}
            <PaginationItem>
              <PaginationNext
                onClick={() => nextPage()}
                disabled={currentPage === totalPages - 1}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
};

export default TicketList;
