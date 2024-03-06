import { PlayType } from "@/types";
import { FC, ReactNode, useEffect } from "react";
import PlayCard from "./play-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useParams, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
// import { Separator } from "@/components/ui/separator";
interface PlayListProps {
  plays: PlayType[];
}

const CARDS_PER_PAGE = 8;

const PlayList: FC<PlayListProps> = (props) => {
  const { plays } = props;
  const {
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    getCurrentPageData,
  } = usePagination(CARDS_PER_PAGE, plays);

  const params = useParams();

  const locale = params.locale;

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has("page")) {
      const currentPageIndex = searchParams.get("page");
      goToPage(Number(currentPageIndex));
    }
  }, [searchParams]);
  return (
    <section className="w-full flex flex-col">
      {/**TODO: filter plays */}
      <div className="w-full gap-6 mt-2  grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        {getCurrentPageData().map((play) => (
          <PlayCard
            key={play.id}
            play={play}
            className="w-full h-80  md:w-full md:h-80"
          />
        ))}
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={previousPage}
              disabled={currentPage === 0}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href={`/${locale}/plays?page=${index}`}
                className={cn(index === currentPage && "bg-primary text-white")}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {/* <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem> */}
          <PaginationItem>
            <PaginationNext
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
};

export default PlayList;
