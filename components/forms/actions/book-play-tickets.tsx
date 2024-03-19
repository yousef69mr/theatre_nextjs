"use client";

import {
  FC,
  HtmlHTMLAttributes,
  useEffect,
  //   useEffect,
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

import { FestivalType, PlayType, TicketType } from "@/types";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

// import { SingleImageUpload } from "@/components/helpers/single-image-upload";
import {
  Calendar,
  Check,
  ChevronsUpDown,
  Loader2,
  PlusCircle,
} from "lucide-react";

import toast from "react-hot-toast";

import { Separator } from "@/components/ui/separator";

import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/stores/use-modal-store";

import { usePlayStore } from "@/hooks/stores/use-play-store";
import { useFestivalStore } from "@/hooks/stores/use-festivals-store";

import { Input } from "@/components/ui/input";
import { MultiInput } from "@/components/ui/multi-input";
import { bookPlayTicketsSchema } from "@/lib/validations/actions/book-ticket-action";
import { isAdmin } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { useCurrentRole } from "@/hooks/use-current-role";
import { createPlayTicketsRequest } from "@/lib/api-calls/actions/book-play-tickets";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useTicketStore } from "@/hooks/stores/use-ticket-store";

interface BookPlayTicketsFormProps extends HtmlHTMLAttributes<HTMLElement> {
  play: PlayType | null;
  userTickets: TicketType[];
  mode?: "modal" | "page";
}

type BookPlayTicketsFormValues = Zod.infer<typeof bookPlayTicketsSchema>;

const BookPlayTicketsForm: FC<BookPlayTicketsFormProps> = (props) => {
  const { play, userTickets, className, mode = "page" } = props;

  const role = useCurrentRole();

  const onClose = useModal((state) => state.onClose);
  const onOpen = useModal((state) => state.onOpen);
  const addTickets = useTicketStore((state) => state.addTickets);

  const [festivals, setFestivals] = useState<
    (FestivalType & {
      showTimes: string[];
      guestTicketLimit: number;
      actorTicketLimit: number;
    })[]
  >();
  const [numberOfGuest, setNumberOfGuest] = useState<number>(0);
  const [availableShowTimes, setAvailableShowTimes] = useState<string[]>();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();

  //   const locale = params.locale;

  const playId = params.playId as string;

  const form = useForm<BookPlayTicketsFormValues>({
    resolver: zodResolver(bookPlayTicketsSchema),
    defaultValues: {
      guestNames: [],
      festivalId: play?.festivals[0].festival.id || undefined,
      playId,
    },
  });

  const onSubmit = async (values: BookPlayTicketsFormValues) => {
    if (values.guestNames.length === 0) {
      form.setError("guestNames", {
        message: "quest names should be at least one",
      });
      return;
    }
    setIsLoading(true);

    startTransition(() => {
      createPlayTicketsRequest(values)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then(async (data) => {
          addTickets(data);
          // console.log(localPlays);
          router.refresh();
          if (mode === "page") {
            //   router.push(`/${locale}/admin/actors`);
          } else {
            onClose();
            form.reset();
          }
        })
        .catch((error) => {
          toast.error(error.message);
          console.error(error);
        })
        .finally(() => setIsLoading(false));
    });
  };

  const submitBtn = t("book.default", { ns: "constants" });
  const submitingText = `${t("book.loading", { ns: "constants" })}...`;

  const isSubmitting = isPending || form.formState.isSubmitting || isLoading;
  const isDisabled = isUploadingFile || isSubmitting;

  const onPlayChange = (selectedPlay: PlayType | null) => {
    // console.log(selectedPlay);
    if (!selectedPlay) return;

    const formattedFestivals: (FestivalType & {
      showTimes: string[];
      guestTicketLimit: number;
      actorTicketLimit: number;
    })[] = selectedPlay.festivals
      ?.map((festival) => ({
        ...festival.festival,
        showTimes: festival.showTimes,
        actorTicketLimit: festival.actorTicketLimit,
        guestTicketLimit: festival.guestTicketLimit,
      }))
      .filter((festival) => {
        const festivalShowTimes = festival.showTimes.filter(
          (show) => new Date(show) > new Date()
        );
        if (festivalShowTimes.length > 0) {
          return true;
        }
        return false;
      });
    // console.log(formattedFestivals.length);
    if (formattedFestivals.length === 1) {
      form.setValue("festivalId", formattedFestivals[0].id);
      form.trigger("festivalId");
    }
    setFestivals(formattedFestivals);
  };

  const onFestivalChange = (festivalId: string) => {
    const selectedFestival = festivals?.find(
      (festival) => festival.id === festivalId
    );
    // console.log(selectedPlay);
    if (!selectedFestival) return;

    const festivalShowTimes = selectedFestival.showTimes.filter(
      (show) => new Date(show) > new Date()
    );

    // console.log(festivalShowTimes);
    if (festivalShowTimes.length === 1) {
      form.setValue("showTime", festivalShowTimes[0]);
      form.trigger("showTime");
    }
    if (role === UserRole.USER) {
      setNumberOfGuest(selectedFestival.guestTicketLimit);
    } else if (role === UserRole.ACTOR) {
      setNumberOfGuest(selectedFestival.actorTicketLimit);
    }else{
      setNumberOfGuest(2)
    }

    setAvailableShowTimes(festivalShowTimes);
  };

  useEffect(() => {
    onPlayChange(play);
  }, [play]);

  useEffect(() => {
    const festivalId = form.getValues("festivalId");
    // console.log(playId);
    if (festivalId) {
      onFestivalChange(festivalId);
    }
  }, [form.getValues("festivalId"), festivals, role]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "flex flex-col w-full space-y-4",
          numberOfGuest === 1 && "min-w-[250px] md:min-w-[400px]",
          className
        )}
      >
        {festivals && festivals.length > 1 && (
          <FormField
            control={form.control}
            name="festivalId"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>
                  {t("forms.labels.festivalName", { ns: "constants" })}
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
                          ? festivals?.find(
                              (festival) => festival.id === field.value
                            )?.name
                          : t("actions.select", {
                              ns: "common",
                              instance: t("festival.single", {
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
                          instance: t("festival.single", {
                            ns: "constants",
                          }),
                        })}
                      />
                      <CommandEmpty>
                        {t("notFound", {
                          ns: "constants",
                          instance: t("festival.single", {
                            ns: "constants",
                          }),
                        })}
                      </CommandEmpty>
                      <CommandGroup>
                        {festivals?.map((festival) => (
                          <CommandItem
                            value={festival.id}
                            key={festival.id}
                            onSelect={() => {
                              form.setValue("festivalId", festival.id);
                              form.trigger("festivalId");
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                festival.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {festival.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      {isAdmin(role as UserRole) && (
                        <>
                          <Separator />
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                onOpen("createFestival");
                              }}
                            >
                              <PlusCircle
                                className={cn(
                                  "ltr:mr-2 rtl:ml-2 h-4 w-4 text-emerald-600"
                                )}
                              />
                              {t("actions.create", {
                                ns: "common",
                                instance: t("festival.single", {
                                  ns: "constants",
                                }),
                              })}
                            </CommandItem>
                          </CommandGroup>
                        </>
                      )}
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {numberOfGuest > 1 ? (
          <FormField
            control={form.control}
            name="guestNames"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {t("forms.labels.guestNames", {
                    ns: "constants",
                  })}
                </FormLabel>
                <FormControl>
                  <MultiInput
                    values={field.value || []}
                    onChange={(values) => {
                      form.setValue("guestNames", values);
                      form.trigger("guestNames");
                    }}
                    placeholder={t("forms.placeholder.guestNames", {
                      ns: "constants",
                    })}
                    name={field.name}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    disabled={isDisabled}
                    //   type="text"
                  />
                </FormControl>

                <FormDescription>
                  <span>**</span>{" "}
                  {t("forms.description.guestNames", { ns: "constants" })}
                </FormDescription>

                {form.getFieldState("guestNames").isTouched && <FormMessage />}
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="guestNames"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {t("forms.labels.guestName", {
                    ns: "constants",
                  })}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("forms.placeholder.guestName", {
                      ns: "constants",
                    })}
                    name={field.name}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    disabled={isDisabled}
                    onChange={(event) => {
                      form.setValue("guestNames", [event.target.value]);
                      form.trigger("guestNames");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="showTime"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                {t("forms.labels.showTimes", {
                  ns: "constants",
                })}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("actions.select", {
                        ns: "common",
                        instance: t("forms.labels.showTimes", {
                          ns: "constants",
                        }),
                      })}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableShowTimes?.map((showTime) => (
                    <SelectItem value={showTime} key={showTime}>
                      <div className="flex items-center justify-start gap-2">
                        <Calendar className="w-5 h-5 rtl:ml-2 ltr:mr-2" />
                        <span>
                          {format(new Date(showTime), "yyyy-MM-do HH:mm:ss")}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />
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

export default BookPlayTicketsForm;
