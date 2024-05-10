"use client";

import {
  FC,
  HtmlHTMLAttributes,
  useEffect,
  useReducer,
  useState,
  useTransition,
} from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { TicketType, FestivalType, UserType } from "@/types";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

// import { SingleImageUpload } from "@/components/helpers/single-image-upload";
import { Check, ChevronsUpDown, Loader2, PlusCircle } from "lucide-react";

import toast from "react-hot-toast";

import { Separator } from "@/components/ui/separator";

import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/stores/use-modal-store";

import { usePlayStore } from "@/hooks/stores/use-play-store";
import { useFestivalStore } from "@/hooks/stores/use-festivals-store";
import { useTicketStore } from "@/hooks/stores/use-ticket-store";
import { MultiInput } from "@/components/ui/multi-input";

import { isAdmin } from "@/lib/auth";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { getNotScanedTicketsRequest } from "@/lib/api-calls/models/ticket";
import { scanTicketsRequest } from "@/lib/api-calls/actions/scan-tickets";
import { scanPlayTicketsSchema } from "@/lib/validations/actions/scan-ticket-action";

interface ScanPlayTickeFormProps extends HtmlHTMLAttributes<HTMLElement> {
  initialData: {
    playId?: string | null;
    festivalId?: string | null;
  } | null;
  mode?: "modal" | "page";
}

type ScanPlayTicketFormValues = Zod.infer<typeof scanPlayTicketsSchema>;

const ScanPlayTickeForm: FC<ScanPlayTickeFormProps> = (props) => {
  const { initialData, className, mode = "page" } = props;
  const { onClose } = useModal();
  const currentUserRole = useCurrentRole();
  // console.log(initialData);
  const [tickets, setTickets] = useState<TicketType[] | undefined>();
  const [selectedTicket, setSelectedTicket] = useState<
    TicketType | undefined
  >();
  // const updateFestivalTickets = useFestivalStore(
  //   (state) => state.updateFestivalTickets
  // );

  const onOpen = useModal((state) => state.onOpen);

  // console.log(localPlays, localPlays?.length);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();

  //   const locale = params.locale;

  // const festivalId = params.festivalId as string;
  const playId = (params.playId as string) || initialData?.playId;
  // const festivalId = (params.festivalId as string) || initialData?.festivalId;

  const form = useForm<ScanPlayTicketFormValues>({
    resolver: zodResolver(scanPlayTicketsSchema),
    defaultValues: {
      ticketId: undefined,
    },
  });

  const onSubmit = async (values: ScanPlayTicketFormValues) => {
    setIsLoading(true);

    const ticketUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/api/tickets/${values.ticketId}/scan`;

    startTransition(async () => {
      await scanTicketsRequest(ticketUrl)
        .then((data) => {
          // console.log(localPlays);
          toast.success(
            t("messages.scanned", {
              ns: "constants",
              instance: t("ticket.single", { ns: "constants" }),
            })
          );

          router.refresh();

          if (mode === "page") {
            //   router.push(`/${locale}/admin/tickets`);
          } else {
            onClose();
            form.reset();
          }
        })
        .catch((error: Error) => toast.error(error.message))
        .finally(() => setIsLoading(false));

      // addTicket(data);
      // updateUserTickets(data);
      // updatePlayTickets(data);
      // updateFestivalTickets(data);
    });
  };

  const submitBtn = t("scan.default", { ns: "constants" });

  const submitingText = `${t("scan.loading", { ns: "constants" })}...`;

  const isSubmitting = isPending || form.formState.isSubmitting || isLoading;
  const isDisabled = isUploadingFile || isSubmitting;

  useEffect(() => {
    getNotScanedTicketsRequest({ playId })
      .then((responseData) => {
        setTickets(responseData);
      })
      .catch((error) => console.error(error));
  }, [playId]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col w-full space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="ticketId"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end">
              <FormLabel>
                {t("forms.labels.ticketId", { ns: "constants" })}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? `${
                            tickets?.find((ticket) => ticket.id === field.value)
                              ?.guestName
                          }
             
                          (${
                            tickets?.find((ticket) => ticket.id === field.value)
                              ?.id
                          })`
                        : t("actions.select", {
                            ns: "common",
                            instance: t("ticket.single", {
                              ns: "constants",
                            }),
                          })}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder={t("actions.select", {
                        ns: "common",
                        instance: t("ticket.single", {
                          ns: "constants",
                        }),
                      })}
                    />
                    <CommandEmpty>
                      {t("errors.notFound", {
                        ns: "constants",
                        instance: t("ticket.single", {
                          ns: "constants",
                        }),
                      })}
                    </CommandEmpty>
                    <CommandGroup>
                      {tickets?.map((ticket) => (
                        <CommandItem
                          value={`${ticket.guestName} (${ticket.id})`}
                          key={ticket.id}
                          onSelect={() => {
                            form.setValue("ticketId", ticket.id);
                            setSelectedTicket(ticket);
                          }}
                          className="flex flex-nowrap"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              ticket.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {ticket.guestName} ({ticket.id})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        {selectedTicket && (
          <>
            <div className="border rounded-full flex flex-col p-5 justify-center items-center">
              <p className="truncate break-all text-sm md:text-lg">
                #{selectedTicket.id}
              </p>
              <p className="truncate break-all text-sm md:text-lg">
                {selectedTicket.guestName}
              </p>
              <p className="truncate break-all text-sm md:text-lg">
                {selectedTicket.play.name}
              </p>
              <p className="truncate break-all text-sm md:text-lg">
                {selectedTicket.festival.name}
              </p>
            </div>
            <Separator />
          </>
        )}

        <div className="flex w-full justify-end items-center">
          <Button type="submit" disabled={isDisabled}>
            {isSubmitting ? (
              <>
                <Loader2 className="ltr:mr-2 rtl:ml-2 h-4 w-4 animate-spin" />
                {submitingText}
              </>
            ) : (
              submitBtn
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ScanPlayTickeForm;
