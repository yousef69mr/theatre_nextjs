// import { ActorType, ExecutorType, PlayType } from "@/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type DateType = any[];

export const usePagination = (
  itemsPerPage: number,
  searchKey: string = "page",
  data: DateType
) => {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  // const params = useParams();

  // const locale = params.locale;

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const getCurrentPageData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const nextPage = (url?: string) => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);

      url && router.push(`${url}?${searchKey}=${currentPage + 1}`);
    }
  };

  const previousPage = (url?: string) => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      url && router.push(`${url}?${searchKey}=${currentPage - 1}`);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPage(pageIndex);
    }
  };

  // console.log(currentPage, totalPages);
  return {
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    getCurrentPageData,
  };
};
