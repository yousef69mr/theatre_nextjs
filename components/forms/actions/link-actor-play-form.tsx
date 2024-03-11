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

import { ActorInPlayType, FestivalType } from "@/types";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

// import { SingleImageUpload } from "@/components/helpers/single-image-upload";
import { Check, ChevronsUpDown, Loader2, PlusCircle } from "lucide-react";

import toast from "react-hot-toast";

import { Separator } from "@/components/ui/separator";

import { useTranslation } from "react-i18next";

import { actorInPlaySchema } from "@/lib/validations/actions/link-model-actions";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/stores/use-modal-store";

import {
  createActorInPlayRequest,
  updateActorInPlayRequest,
} from "@/lib/api-calls/actions/actor-in-play";

import { usePlayStore } from "@/hooks/stores/use-play-store";
import { useFestivalStore } from "@/hooks/stores/use-festivals-store";
import { useActorStore } from "@/hooks/stores/use-actor-store";
import { MultiInput } from "@/components/ui/multi-input";

interface LinkActorPlayFormProps extends HtmlHTMLAttributes<HTMLElement> {
  initialData: ActorInPlayType | null;
  mode?: "modal" | "page";
}

type LinkActorPlayFormValues = Zod.infer<typeof actorInPlaySchema>;

const LinkActorPlayForm: FC<LinkActorPlayFormProps> = (props) => {
  const { initialData, className, mode = "page" } = props;
  const { onClose } = useModal();
  // console.log(initialData);
  const [festivals, setFestivals] = useState<FestivalType[] | undefined>();
  const updateFestivalActors = useFestivalStore(
    (state) => state.updateFestivalActors
  );
  const updatePlayActors = usePlayStore((state) => state.updatePlayActors);
  const updateActorPlays = useActorStore((state) => state.updateActorPlays);
  const onOpen = useModal((state) => state.onOpen);
  const localActors = useActorStore((state) => state.actors);
  const localPlays = usePlayStore((state) => state.plays);
  const localFestivals = useFestivalStore((state) => state.festivals);
  // console.log(localPlays, localPlays?.length);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();

  //   const locale = params.locale;

  const festivalId = params.festivalId as string;
  const actorId = params.actorId as string;
  const playId = params.playId as string;

  const form = useForm<LinkActorPlayFormValues>({
    resolver: zodResolver(actorInPlaySchema),
    defaultValues: {
      actorId: actorId || initialData?.actor.id,
      playId: playId || initialData?.play.id,
      festivalId: festivalId || initialData?.festival.id,
    },
  });

  const onSubmit = async (values: LinkActorPlayFormValues) => {
    setIsLoading(true);

    startTransition(() => {
      if (initialData) {
        updateActorInPlayRequest(values, initialData.id)
          .then((response) => response.json())
          .then(async (data) => {
            toast.success(
              t("messages.updated", {
                ns: "constants",
                instance: t("actions.linkTo", {
                  ns: "common",
                  instance: t("actor.single", { ns: "constants" }),
                  to: t("play.single", { ns: "constants" }),
                }),
              })
            );

            // addActor(data);
            updateActorPlays(data);
            updatePlayActors(data);
            updateFestivalActors(data);

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
        createActorInPlayRequest(values)
          .then((response) => response.json())
          .then(async (data) => {
            toast.success(
              t("messages.created", {
                ns: "constants",
                instance: t("actions.linkTo", {
                  ns: "common",
                  instance: t("actor.single", { ns: "constants" }),
                  to: t("play.single", { ns: "constants" }),
                }),
              })
            );

            // addActor(data);
            updateActorPlays(data);
            updatePlayActors(data);
            updateFestivalActors(data);

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

  const onPlayChange = (playId: string) => {
    const selectedPlay = localPlays?.find((play) => play.id === playId);
    // console.log(selectedPlay);
    if (!selectedPlay) return;

    const formattedFestivals: FestivalType[] = selectedPlay.festivals?.map(
      (festival) => ({ ...festival.festival })
    );
    // console.log(formattedFestivals.length);
    if (formattedFestivals.length === 1) {
      form.setValue("festivalId", formattedFestivals[0].id);
      form.trigger("festivalId");
    }
    setFestivals(formattedFestivals);
  };

  useEffect(() => {
    const playId = form.getValues("playId");
    // console.log(playId);
    if (playId) {
      onPlayChange(playId);
    } else {
      setFestivals(localFestivals || undefined);
    }
  }, [form.getValues("playId"), localPlays]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col w-full space-y-4", className)}
      >
        {!actorId && (
          <FormField
            control={form.control}
            name="actorId"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>
                  {t("forms.labels.actorName", { ns: "constants" })}
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
                              localActors?.find(
                                (actor) => actor.id === field.value
                              )?.name
                            } ${
                              localActors?.find(
                                (actor) => actor.id === field.value
                              )?.nickname
                                ? `(${
                                    localActors?.find(
                                      (actor) => actor.id === field.value
                                    )?.nickname
                                  })`
                                : ""
                            }`
                          : t("actions.select", {
                              ns: "common",
                              instance: t("actor.single", {
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
                          instance: t("actor.single", {
                            ns: "constants",
                          }),
                        })}
                      />
                      <CommandEmpty>
                        {t("notFound", {
                          ns: "constants",
                          instance: t("actor.single", {
                            ns: "constants",
                          }),
                        })}
                      </CommandEmpty>
                      <CommandGroup>
                        {localActors?.map((actor) => (
                          <CommandItem
                            value={actor.id}
                            key={actor.id}
                            onSelect={() => {
                              form.setValue("actorId", actor.id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                actor.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {actor.name}{" "}
                            {actor.nickname ? `(${actor.nickname})` : ""}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <Separator />
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            onOpen("createActor");
                          }}
                        >
                          <PlusCircle
                            className={cn(
                              "ltr:mr-2 rtl:ml-2 h-4 w-4 text-emerald-600"
                            )}
                          />
                          {t("actions.create", {
                            ns: "common",
                            instance: t("actor.single", {
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
        {!festivalId && festivals && festivals.length > 1 && (
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
          name="characterNames"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end">
              <FormLabel>
                {t("forms.labels.characterNames", { ns: "constants" })}
              </FormLabel>
              <MultiInput
                values={initialData?.characterNames || []}
                placeholder={t("forms.placeholder.characterNames", {
                  ns: "constants",
                })}
                onChange={(values) => {
                  form.setValue("characterNames", values);
                  form.trigger("characterNames");
                }}
                disabled={isDisabled}
              />
              <FormDescription>// description</FormDescription>
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

export default LinkActorPlayForm;
