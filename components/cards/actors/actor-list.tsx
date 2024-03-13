import { ActorType } from "@/types";
import { FC, useEffect } from "react";
import ActorCard from "./actor-card";
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
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
// import { Separator } from "@/components/ui/separator";
interface ActorListProps {
  actors: ActorType[];
}

const CARDS_PER_PAGE = 8;

const ActorList: FC<ActorListProps> = (props) => {
  const { actors } = props;
  const searchKey = "actorPage";
  const {
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    getCurrentPageData,
  } = usePagination(CARDS_PER_PAGE, searchKey, actors);

  const params = useParams();
  const pathname = usePathname();

  const locale = params.locale;

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has(searchKey)) {
      const currentPageIndex = searchParams.get(searchKey);
      goToPage(Number(currentPageIndex) - 1);
    }
  }, [searchParams]);
  return (
    <section className="w-full flex flex-col">
      {/**TODO: filter plays */}
      <div className="w-full gap-6 mt-2  grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        {getCurrentPageData().map((actor) => (
          <ActorCard
            key={actor.id}
            actor={actor}
            className="w-full h-80 md:w-full md:h-80"
          />
        ))}
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => previousPage(pathname)}
              disabled={currentPage === 0}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href={`/${locale}/actors?${searchKey}=${index + 1}`}
                className={cn(index === currentPage && "bg-primary text-white")}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => nextPage(pathname)}
              disabled={currentPage === totalPages - 1}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
};

export default ActorList;
