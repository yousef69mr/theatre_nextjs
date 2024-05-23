"use client"
import { ExecutorType } from "@/types";
import { FC, useEffect } from "react";
import ExecutorCard from "./executor-card";
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
interface ExecutorListProps {
  executors: ExecutorType[];
  cardsPerPage?:number
}

const CARDS_PER_PAGE = 8;

const ExecutorList: FC<ExecutorListProps> = (props) => {
  const { executors,cardsPerPage=CARDS_PER_PAGE } = props;
  const searchKey = "executorPage";
  const {
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    getCurrentPageData,
  } = usePagination(cardsPerPage, searchKey, executors);

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
        {getCurrentPageData().map((executor) => (
          <ExecutorCard
            key={executor.id}
            executor={executor}
            className="w-full h-80 md:w-full md:h-80"
          />
        ))}
      </div>
      {totalPages > 1 && (
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
                  href={`/${locale}/executors?${searchKey}=${index + 1}`}
                  className={cn(
                    index === currentPage && "bg-primary text-white"
                  )}
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
      )}
    </section>
  );
};

export default ExecutorList;
