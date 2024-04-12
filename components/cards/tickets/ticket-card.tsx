"use client";

import { FC, HTMLAttributes } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatBigInt } from "@/lib/helpers/bigInt-converter";
import { TicketCardType } from "@/types";
import {
  Eye,
  PartyPopper,
  Tag,
  Contact,
  Theater,
  Calendar,
  Scan,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useParams } from "next/navigation";
import { removeArrayDuplicates } from "@/lib/helpers/list-fomratters";
import { Badge } from "@/components/ui/badge";
import { FacultyCast } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "date-fns";
import { useModal } from "@/hooks/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { isAdmin } from "@/lib/auth";
// import { useCurrentRole } from "@/hooks/use-current-role";
// import { UserRole } from "@prisma/client";
interface TicketCardProps extends HTMLAttributes<HTMLElement> {
  ticket: TicketCardType;
}
const TicketCard: FC<TicketCardProps> = (props) => {
  const { ticket, className } = props;
  const { t } = useTranslation();
  const params = useParams();
  const onOpen = useModal((state) => state.onOpen);
  // const router = useRouter();
  // const role = useCurrentRole();

  const locale = params.locale as string;

  // const handleEdit = () => {
  //   router.push(`/${locale}/admin/tickets/${ticket.id}`);
  // };

  const handleScan = () => {
    onOpen("scanTicket", { ticket });
  };

  return (
    <TooltipProvider>
      <Card className="relative">
        <Tooltip>
          <TooltipTrigger
            className={cn(
              "z-10 w-5 h-5 rounded-full absolute ltr:right-2 rtl:left-2 top-2",
              ticket.isScanned && "bg-emerald-500",
              !ticket.isScanned && "bg-gray-300"
            )}
          >
            <div />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {ticket.isScanned ? t("status.scanned") : t("status.notScanned")}
            </p>
          </TooltipContent>
        </Tooltip>
        <CardHeader>
          <CardTitle className="text-wrap text-md break-words text-orange-300">
            {ticket.id}
          </CardTitle>
          {!ticket.isScanned && (
            <div className="flex items-center justify-between">
              <Button onClick={handleScan} size={"sm"}>
                <Scan className="rtl:ml-2 ltr:mr-2 w-5 h-5" />
                {`${t("scan.default", {
                  ns: "constants",
                })} ${t("ticket.single", { ns: "constants" })}`}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 text-xs font-medium">
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center justify-center md:text-lg">
                  <Contact className="rtl:ml-2 ltr:mr-2 w-5 h-5 text-primary" />{" "}
                  {ticket.guestName}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("forms.labels.guestName", { ns: "constants" })}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* <p className=" text-gray-600">Date: May 15, 2023</p>
          <p className="mt-2 text-gray-600">Time: 7:00 PM</p>
          <p className="mt-2 text-gray-600">Location: Venue Name, City</p>
          <p className="mt-2 text-gray-600">Seat Number: A12</p> */}
          <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium">
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center justify-center md:text-lg">
                  <Theater className="rtl:ml-2 ltr:mr-2 w-5 h-5 text-primary" />{" "}
                  {ticket.play.name}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("forms.labels.playName", { ns: "constants" })}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium">
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center justify-center md:text-lg">
                  <PartyPopper className="rtl:ml-2 ltr:mr-2 w-5 h-5 text-primary" />{" "}
                  {ticket.festival.name}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("forms.labels.festivalName", { ns: "constants" })}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-3 text-xs font-medium justify-between">
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center justify-center">
                  <Calendar className="rtl:ml-2 ltr:mr-2 w-5 h-5 text-primary" />{" "}
                  {formatDate(ticket.showTime, "dd-MMM-yyyy (HH:mm)")}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("showTime.single", { ns: "constants" })}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center justify-center">
                  <Tag className="rtl:ml-2 ltr:mr-2 w-5 h-5 text-primary" />{" "}
                  {ticket.price > 0
                    ? `${ticket.price}$`
                    : t("status.free", { ns: "common" })}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {" "}
                  {ticket.price > 0
                    ? `${ticket.price}$`
                    : t("status.free", { ns: "common" })}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default TicketCard;
