"use client";

import ActorInPlayCard from "@/components/cards/admin/actor-play-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  // CommandSeparator,
} from "@/components/ui/command";
import { useModal } from "@/hooks/stores/use-modal-store";
import { cn } from "@/lib/utils";
import { PlayFestivalType } from "@/types";
import { PlusCircle, Search } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FestivalPlayCard from "@/components/cards/admin/festival-play-card";
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  // PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
interface FestivalPlayControlProps {
  festivalPlayList: PlayFestivalType[];
  type: "festival" | "play";
}

const CARDS_PER_PAGE = 4;

const FestivalPlayControl: FC<FestivalPlayControlProps> = (props) => {
  const { festivalPlayList, type } = props;
  const { t } = useTranslation();
  const onOpen = useModal((state) => state.onOpen);
  
  const [isMounted, setIsMounted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchKey = `${type}Page`;

  const {
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    getCurrentPageData,
  } = usePagination(CARDS_PER_PAGE, searchKey, festivalPlayList);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleSearching = () => {
    setIsSearching((prev) => !prev);
  };
  //   console.log(actorInPlayList);
  return (
    <div className="mt-6 border rounded-md p-4 space-y-2">
      <div className="font-medium flex items-center justify-between">
        <div className="flex items-center justify-center">
          <span className="capitalize">
            {t(`${type}.plural`, { ns: "constants" })}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => onOpen("linkFestivalPlay")}
                  variant="ghost"
                  className="capitalize"
                >
                  <PlusCircle className="h-5 w-5 text-emerald-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t("actions.add", {
                    instance: t(`${type}.single`, { ns: "constants" }),
                    ns: "common",
                  })}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleSearching} variant={"ghost"} size={"sm"}>
                  <Search className="w-5 h-5 md:ltr:mr-2 md:rtl:ml-2" />
                  <span className="hidden md:block">
                    {t("actions.search", {
                      instance: t(`${type}.plural`, { ns: "constants" }),
                    })}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t("actions.search", {
                    instance: t(`${type}.plural`, { ns: "constants" }),
                  })}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <CommandDialog open={isSearching} onOpenChange={handleSearching}>
            <CommandInput
              placeholder={t("actions.search", {
                ns: "common",
                instance: t(`${type}.plural`, { ns: "constants" }),
              })}
            />
            <CommandList>
              <CommandEmpty>
                {t("notFound", {
                  ns: "constants",
                  instance: t(`${type}.plural`, { ns: "constants" }),
                })}
              </CommandEmpty>
              <CommandGroup
                heading={t(`${type}.plural`, { ns: "constants" })}
                className="capitalize"
              >
                {festivalPlayList.map((festivalPlay) => (
                  <CommandItem key={festivalPlay.id}>
                    <FestivalPlayCard
                      key={festivalPlay.id}
                      festivalPlay={festivalPlay}
                      mode="search"
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>
      </div>
      <Separator />
      <div
        className={cn(
          "flex items-center justify-center",
          festivalPlayList.length > 0 && "justify-start flex-wrap gap-3 py-1"
        )}
      >
        {festivalPlayList.length > 0 ? (
          getCurrentPageData().map((festivalPlay) => (
            <FestivalPlayCard
              key={festivalPlay.id}
              festivalPlay={festivalPlay}
            />
          ))
        ) : (
          <p className="text-muted-foreground">
            {t("errors.notFound", {
              ns: "constants",
              instance: t(`${type}.plural`, { ns: "constants" }),
            })}
          </p>
        )}
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
    </div>
  );
};

export default FestivalPlayControl;
