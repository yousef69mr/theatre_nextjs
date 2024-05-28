"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CheckSquare, XSquare } from "lucide-react";
import { TicketType } from "@/types";
// import ProgressList from "@/components/helpers/progress-list";
import CellAction from "./cell-actions";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import Link from "next/link";
import QRCode from "react-qr-code";
import { useModal } from "@/hooks/stores/use-modal-store";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
export type TicketColumnDef<TData> = ColumnDef<TData>;

export const TicketColumns: TicketColumnDef<TicketType>[] = [
  {
    accessorKey: "QRCode",
    header: () => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.QRCode", { ns: "constants" })}
          {/* <ArrowUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4" /> */}
        </Button>
      );
    },
    cell: ({ row }) => {
      const ticket = row.original as unknown as TicketType;

      const onOpen = useModal((state) => state.onOpen);
      const ticketScanUrlValue = `${process.env.NEXT_PUBLIC_DOMAIN}/api/tickets/${ticket?.id}/scan`;

      const handleTicketScan = () => {
        onOpen("qrTicket", { ticket });
      };
      return (
        <div
          className="flex items-center justify-center w-24 cursor-pointer"
          onClick={handleTicketScan}
        >
          <QRCode
            size={256}
            className="w-full h-full max-w-full object-contain rounded-lg !relative"
            value={ticketScanUrlValue}
            viewBox={`0 0 256 256`}
          />
        </div>
      );
    },
    meta: {
      type: "image",
    },
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
    meta: {
      type: "string",
    },
    // cell: ({ row }) => <div>{row.original.employeeID.toString()}</div>,
  },
  {
    accessorKey: "guestName",
    accessorFn: (originalRow) => {
      const guestName = originalRow.guestName;
      return guestName;
    },
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.guestName", { ns: "constants" })}
          <ArrowUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const ticket = row.original as unknown as TicketType;
      return (
        <div className="flex items-center justify-center">
          <p>{ticket.guestName}</p>
        </div>
      );
    },
    meta: {
      type: "string",
    },
  },
  {
    accessorKey: "playName",
    accessorFn: (originalRow) => {
      const play = originalRow.play;
      const playName = play.name;
      return playName;
    },
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
      const params = useParams();
      const play = row.original.play;
      // console.log(director);

      return (
        <Link href={`/${params.locale}/admin/plays/${play?.id}`}>
          <div className="flex items-center justify-center">
            <p className="hover:text-orange-300 truncate">{play.name}</p>
          </div>
        </Link>
      );
    },
    meta: {
      type: "string",
    },
  },
  {
    accessorKey: "festivalName",
    accessorFn: (originalRow) => {
      const festival = originalRow.festival;
      const festivalName = festival.name;
      return festivalName;
    },
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.festivalName", { ns: "constants" })}
          <ArrowUpDown className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const festival = row.original.festival;
      // console.log(director);

      return (
        <div className="flex items-center justify-center">
          <p className="truncate">{festival.name}</p>
        </div>
      );
    },
    meta: {
      type: "string",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      const { t } = useTranslation();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("tables.status", { ns: "constants" })}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { t } = useTranslation();
      const isScanned = row.original.isScanned;

      return (
        <>
          {isScanned ? (
            <div className="flex items-center justify-center gap-x-2">
              <CheckSquare className=" h-8 w-8 text-emerald-500" />{" "}
              <span className="hidden md:block text-ms">
                {t("status.scanned", { ns: "common" })}
              </span>
            </div>
          ) : (
            <div className="flex gap-x-2 items-center justify-center">
              <XSquare className=" h-8 w-8 text-red-500" />
              <span className="hidden md:block text-ms">
                {t("status.notScanned", { ns: "common" })}
              </span>
            </div>
          )}
        </>
      );
    },
    meta: {
      type: "boolean",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    meta: {
      type: "actions",
    },
  },
];
