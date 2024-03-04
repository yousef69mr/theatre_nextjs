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
import { useParams, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
// import { Separator } from "@/components/ui/separator";
interface ExecutorListProps {
  executors: ExecutorType[];
}

const CARDS_PER_PAGE = 8;

const ExecutorList: FC<ExecutorListProps> = (props) => {
  const { executors } = props;
  const {
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    getCurrentPageData,
  } = usePagination(CARDS_PER_PAGE, executors);

  const params = useParams();

  const locale = params.locale;

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has("page")) {
      const currentPageIndex = searchParams.get("page");
      goToPage(Number(currentPageIndex) - 1);
    }
  }, [searchParams]);
  return (
    <section className="w-full flex flex-col">
      {/**TODO: filter plays */}
      <div className="w-full flex flex-1 flex-wrap gap-6 mt-2 items-center justify-start">
        {getCurrentPageData().map((executor) => (
          <ExecutorCard key={executor.id} executor={executor} />
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
                href={`/${locale}/executors?page=${index + 1}`}
                className={cn(index === currentPage && "bg-primary text-white")}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
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

export default ExecutorList;
