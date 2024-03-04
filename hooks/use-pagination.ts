import { ActorType, ExecutorType, PlayType } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type DateType = PlayType[] | ExecutorType[] | ActorType[] | any[];

export const usePagination = (itemsPerPage: number, data: DateType) => {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const params = useParams();

  const locale = params.locale;

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const getCurrentPageData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      router.push(`/${locale}/plays?page=${currentPage + 1}`);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      router.push(`/${locale}/plays?page=${currentPage - 1}`);
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
