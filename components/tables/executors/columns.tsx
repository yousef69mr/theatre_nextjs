"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { ActorType, ExecutorType } from "@/types";
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
import Link from "next/link";
import { useParams } from "next/navigation";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
// import { ExecutorRole } from "@prisma/client";

export type ExecutorColumnDef<TData> = ColumnDef<TData> & {
  type: string; // Replace 'string' with the actual type you want to use
};

export const ExecutorColumns: ExecutorColumnDef<ExecutorType>[] = [
  {
    accessorKey: "profileImg",
    header: () => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          className="hover:bg-inherit hover:text-inherit"
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
        <div className="relative h-24 w-24">
          {/* <AspectRatio ratio={2 / 3} className="bg-muted"> */}
          <Link href={imgUrl ? imgUrl : "/default-profile.png"} target="_blank">
            <Image
              src={imgUrl ? imgUrl : "/default-profile.png"}
              fill
              alt="Image"
              className="rounded-md object-contain"
            />
          </Link>
          {/* </AspectRatio> */}
        </div>
      );
    },
    type: "image",
  },
  {
    accessorKey: "executorName",
    accessorFn: (originalRow) => {
      const executor = originalRow;
      const executorName = `${executor.name} ${
        executor.nickname ? `(${executor.nickname})` : ""
      }`;
      return executorName;
    },
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.executorName", { ns: "constants" })}
          <ArrowUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, getValue }) => {
      const executor = row.original as unknown as ExecutorType;

      const params = useParams();
      const locale = params.locale as string;
      return (
        <Link href={`/${locale}/executors/${executor.id}`} className="hover:text-orange-300">
          <div className="flex items-center justify-center">
            <p>{getValue() as string}</p>
          </div>
        </Link>
      );
    },
    type: "string",
  },
  {
    accessorKey: "awards",
    accessorFn: (originalRow) => {
      const awards = originalRow.awards;

      return awards.length || 0;
    },
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
    cell: ({ getValue }) => {
      const awardsNum = getValue() as number;

      return (
        <div className="flex items-center justify-center">
          <p>{awardsNum}</p>
        </div>
      );
    },
    type: "number",
  },

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
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    type: "action",
  },
];
