"use client";

import {
  FC,
  HtmlHTMLAttributes,
  useEffect,
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

import { FestivalType, PlayFestivalType } from "@/types";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

// import { SingleImageUpload } from "@/components/helpers/single-image-upload";
import { Check, ChevronsUpDown, Loader2, PlusCircle } from "lucide-react";

import toast from "react-hot-toast";

import { Separator } from "@/components/ui/separator";

import { useTranslation } from "react-i18next";

import { festivalPlaySchema } from "@/lib/validations/actions/link-model-actions";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/stores/use-modal-store";

import { usePlayStore } from "@/hooks/stores/use-play-store";
import { useFestivalStore } from "@/hooks/stores/use-festivals-store";
import {
  createFestivalPlayRequest,
  updateFestivalPlayRequest,
} from "@/lib/api-calls/actions/festival-play";
import { Input } from "@/components/ui/input";
import { convertDateTime } from "@/lib/helpers/time-parser";
import { MultiInput } from "@/components/ui/multi-input";

interface LinkActorPlayFormProps extends HtmlHTMLAttributes<HTMLElement> {
  initialData: PlayFestivalType | null;
  mode?: "modal" | "page";
}

type LinkFestivalPlayFormValues = Zod.infer<typeof festivalPlaySchema>;

const LinkFestivalPlayForm: FC<LinkActorPlayFormProps> = (props) => {
  const { initialData, className, mode = "page" } = props;

  const updatePlayFestivals = usePlayStore(
    (state) => state.updatePlayFestivals
  );
  const updateFestivalPlays = useFestivalStore(
    (state) => state.updateFestivalPlays
  );

  const onClose = useModal((state) => state.onClose);
  const onOpen = useModal((state) => state.onOpen);
  const localPlays = usePlayStore((state) => state.plays);
  const localFestivals = useFestivalStore((state) => state.festivals);

  const [festivals, setfestivals] = useState<FestivalType[] | null>([]);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();

  //   const locale = params.locale;

  const festivalId = params.festivalId as string;
  const playId = params.playId as string;

  const form = useForm<LinkFestivalPlayFormValues>({
    resolver: zodResolver(festivalPlaySchema),
    defaultValues: {
      position: initialData?.position || undefined,
      playId: playId || initialData?.play.id,
      festivalId: festivalId || initialData?.festival.id,
      showTimes:
        (initialData?.showTimes && [
          ...initialData?.showTimes.map((showTime) =>
            convertDateTime(showTime)
          ),
        ]) ||
        [],
    },
  });

  const onSubmit = async (values: LinkFestivalPlayFormValues) => {
    setIsLoading(true);

    startTransition(() => {
      if (initialData) {
        updateFestivalPlayRequest(values, initialData.id)
          .then((response) => response.json())
          .then(async (data) => {
            toast.success(
              t("messages.updated", {
                ns: "constants",
                instance: t("actions.linkTo", {
                  ns: "common",
                  instance: t("festival.single", { ns: "constants" }),
                  to: t("play.single", { ns: "constants" }),
                }),
              })
            );

            // addActor(data);

            updatePlayFestivals(data);
            updateFestivalPlays(data);

            router.refresh();

            if (mode === "page") {
              //   router.push(`/${locale}/admin/actors`);
            } else {
              onClose();
              form.reset();
            }
          })
          .catch((error) => toast.error("something went wrong"))
          .finally(() => setIsLoading(false));
      } else {
        createFestivalPlayRequest(values)
          .then((response) => response.json())
          .then(async (data) => {
            toast.success(
              t("messages.created", {
                ns: "constants",
                instance: t("actions.linkTo", {
                  ns: "common",
                  instance: t("festival.single", { ns: "constants" }),
                  to: t("play.single", { ns: "constants" }),
                }),
              })
            );

            // addActor(data);
            updatePlayFestivals(data);
            updateFestivalPlays(data);
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
            toast.error("something went wrong");
            console.error(error);
          })
          .finally(() => setIsLoading(false));
      }
    });
  };

  const submitBtn = initialData
    ? t("edit.default", { ns: "constants" })
    : t("link.default", { ns: "constants" });
  const submitingText = initialData
    ? `${t("edit.loading", { ns: "constants" })}...`
    : `${t("link.loading", { ns: "constants" })}...`;

  const isSubmitting = isPending || form.formState.isSubmitting || isLoading;
  const isDisabled = isUploadingFile || isSubmitting;

  const handleFestivalsOptions = () => {
    // console.log();
    const selectedPlay = localPlays?.find((play) => play.id === playId);
    // console.log(selectedPlay);
    if (!selectedPlay) return;

    const takenFestivalIDs: string[] = selectedPlay.festivals?.map(
      (festival) => festival.festival.id
    );
    // console.log();
    if (localFestivals) {
      const remainingFestivalOptions: FestivalType[] = localFestivals.filter(
        (festival) => !takenFestivalIDs.includes(festival.id)
      );
      setfestivals(remainingFestivalOptions);
    } else {
      setfestivals(localFestivals);
    }
  };
  useEffect(() => {
    handleFestivalsOptions();
  }, [localFestivals, localPlays]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col w-full space-y-4", className)}
      >
        {!playId && (
          <FormField
            control={form.control}
            name="playId"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>
                  {t("forms.labels.playName", { ns: "constants" })}
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
                          ? localPlays?.find((play) => play.id === field.value)
                              ?.name
                          : t("actions.select", {
                              ns: "common",
                              instance: t("play.single", {
                                ns: "constants",
                              }),
                            })}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput
                        placeholder={t("actions.select", {
                          ns: "common",
                          instance: t("play.single", {
                            ns: "constants",
                          }),
                        })}
                      />
                      <CommandEmpty>
                        {t("notFound", {
                          ns: "constants",
                          instance: t("play.single", {
                            ns: "constants",
                          }),
                        })}
                      </CommandEmpty>
                      <CommandGroup>
                        {localPlays?.map((play) => (
                          <CommandItem
                            value={play.id}
                            key={play.id}
                            onSelect={() => {
                              form.setValue("playId", play.id);
                              form.trigger("playId");
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                play.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {play.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <Separator />
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {!festivalId && !initialData && (
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
                          ? localFestivals?.find(
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
                  <PopoverContent className=" p-0">
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
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="showTimes"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                {t("forms.labels.showTimes", {
                  ns: "constants",
                })}
              </FormLabel>
              <FormControl>
                <MultiInput
                  values={field.value || []}
                  onChange={(values) => {
                    form.setValue("showTimes", values);
                    form.trigger("showTimes");
                  }}
                  placeholder={t("forms.placeholder.showTimes", {
                    ns: "constants",
                  })}
                  name={field.name}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  disabled={isDisabled}
                  type="datetime-local"
                />
              </FormControl>
              <FormDescription>
                <span>**</span>{" "}
                {t("forms.description.showTimes", { ns: "constants" })}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                {t("forms.labels.playPlace", {
                  ns: "constants",
                })}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  disabled={isDisabled}
                  placeholder={t("forms.placeholder.playPlace", {
                    ns: "constants",
                  })}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={(event) =>
                    field.onChange(Number(event.target.value))
                  }
                  value={String(field.value)||undefined}
                  // {...field}
                />
              </FormControl>
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

export default LinkFestivalPlayForm;
