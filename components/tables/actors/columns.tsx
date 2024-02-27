"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { ActorType } from "@/types";
import Image from "next/image";

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import ProgressList from "@/components/helpers/progress-list";
import CellAction from "./cell-actions";
import { useTranslation } from "react-i18next";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
// import { ExecutorRole } from "@prisma/client";
import Link from "next/link";

export type ActorColumnDef<TData> = ColumnDef<TData> & {
  type: string; // Replace 'string' with the actual type you want to use
};

export const ActorColumns: ActorColumnDef<ActorType>[] = [
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
    accessorKey: "actorName",
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.actorName", { ns: "constants" })}
          <ArrowUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const play = row.original as unknown as ActorType;
      return (
        <div className="flex items-center justify-center">
          <p>
            {play.name} {play.nickname && `(${play.nickname})`}
          </p>
        </div>
      );
    },
    type: "string",
  },

  {
    accessorKey: "awards",
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.awards", { ns: "constants" })}
          <ArrowUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const awards = row.original.awards;

      return (
        <div className="flex items-center justify-center">
          <p>{awards.length}</p>
        </div>
      );
    },
    type: "number",
  },
  {
    accessorKey: "profileImg",
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.profileImg", { ns: "constants" })}
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </Button>
      );
    },
    cell: ({ row }) => {
      const imgUrl = row.original.imgUrl;
      return (
        <Link href={imgUrl} target="_blank">
          <div className="relative h-24 w-24">
            {/* <AspectRatio ratio={2 / 3} className="bg-muted"> */}
            <Image
              src={imgUrl}
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
