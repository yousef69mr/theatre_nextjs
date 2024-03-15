"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { PlayType } from "@/types";
import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import ProgressList from "@/components/helpers/progress-list";
import CellAction from "./cell-actions";
import { useTranslation } from "react-i18next";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ExecutorRole } from "@prisma/client";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export type PlayColumnDef<TData> = ColumnDef<TData> & {
  type: string; // Replace 'string' with the actual type you want to use
};

export const PlayColumns: PlayColumnDef<PlayType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.id", { ns: "constants" })}
          <ArrowUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      );
    },
    type: "string",
    // cell: ({ row }) => <div>{row.original.employeeID.toString()}</div>,
  },
  {
    accessorKey: "playName",
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.playName", { ns: "constants" })}
          <ArrowUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const play = row.original as unknown as PlayType;
      return (
        <div className="flex items-center justify-center">
          <p>{play.name}</p>
        </div>
      );
    },
    type: "string",
  },
  {
    accessorKey: "director",
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.director", { ns: "constants" })}
          <ArrowUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const director = row.original.executors.find(
        (executor) => executor.role === ExecutorRole.DIRECTOR
      );
      // console.log(director);

      return (
        <div className="flex items-center justify-center">
          <p>
            {director?.executor?.name}{" "}
            {director?.executor?.nickname
              ? `(${director?.executor?.nickname})`
              : ""}
          </p>
        </div>
      );
    },
    type: "string",
  },
  {
    accessorKey: "crew",
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.crew", { ns: "constants" })}
          <ArrowUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { t } = useTranslation();
      const actors = row.original.actors;
      const executors = row.original.executors;
      // console.log(actors, executors);
      const numOfActors = actors.length || 0;
      const numOfExecutors = executors.length || 0;

      const crew =
        numOfActors + numOfExecutors > 0 ? numOfActors + numOfExecutors : 1;
      return (
        <div className="flex items-center justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <p>{crew}</p>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col justify-center items-center gap-y-1">
                  <div className="flex w-full items-center">
                    <span className="w-16 text-center font-bold ltr:mr-1 rtl:ml-1">
                      {t("actor.plural", { ns: "constants" })}
                    </span>

                    <Progress
                      value={(numOfActors * 100) / crew || 0}
                      max={crew}
                      className="min-w-[80px] mx-1 cursor-pointer"
                      title={`${((numOfActors * 100) / crew || 0).toFixed(2)}%`}
                    />
                    <span className="w-16 text-center font-bold rtl:mr-1 ltr:ml-1">
                      {numOfActors}
                    </span>
                  </div>
                  <div className="flex w-full items-center">
                    <span className="min-w-16 text-center font-bold ltr:mr-1 rtl:ml-1">
                      {t("executor.plural", { ns: "constants" })}
                    </span>
                    <Progress
                      value={(numOfExecutors * 100) / crew || 0}
                      max={crew}
                      className="min-w-[80px] mx-1 cursor-pointer"
                      title={`${((numOfExecutors * 100) / crew || 0).toFixed(
                        2
                      )}%`}
                    />
                    <span className="w-16 text-center font-bold rtl:mr-1 ltr:ml-1">
                      {numOfExecutors}
                    </span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    type: "number",
  },
  {
    accessorKey: "poster",
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.poster", { ns: "constants" })}
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </Button>
      );
    },
    cell: ({ row }) => {
      const posterImgUrl = row.original.posterImgUrl
        ? row.original.posterImgUrl
        : "/play-poster-template.png";
      return (
        <Link href={posterImgUrl} target="_blank">
          <div className="relative h-24 w-24">
            {/* <AspectRatio ratio={2 / 3} className="bg-muted"> */}
            <Image
              src={posterImgUrl}
              fill
              alt="Image"
              className="rounded-md object-contain"
            />
            {/* </AspectRatio> */}
          </div>
        </Link>
      );
    },
    type: "image",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    type: "action",
  },
];
