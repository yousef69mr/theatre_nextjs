"use client";

import { FC, useEffect, useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlayType } from "@/types";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { playSchema } from "@/lib/validations/models/play";
import { Button } from "@/components/ui/button";

// import { SingleImageUpload } from "@/components/helpers/single-image-upload";
// import { MultiImageUpload } from "@/components/helpers/multi-images-upload";
import {
  Loader2,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  PlusCircle,
  Pencil,
  X,
} from "lucide-react";
import { addDays, format } from "date-fns";

import {
  createPlayRequest,
  updatePlayRequest,
} from "@/lib/api-calls/models/play";

import toast from "react-hot-toast";
// import { confirmFileUpload } from "@/lib/helpers/confirm-file-upload";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { extractEmbedLink } from "@/lib/helpers/extract-embed-link";
import { useModal } from "@/hooks/stores/use-modal-store";
import { useExecutorStore } from "@/hooks/stores/use-executor-store";
import FileUpload from "../../helpers/file-upload";
import { usePlayStore } from "@/hooks/stores/use-play-store";
import { useFestivalStore } from "@/hooks/stores/use-festivals-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlayFormProps {
  initialData: PlayType | null;
}

type PlayFormValues = Zod.infer<typeof playSchema>;

const PlayForm: FC<PlayFormProps> = (props) => {
  const { initialData } = props;
  const { onOpen } = useModal();

  const localExecutors = useExecutorStore((state) => state.executors);
  const localFestivals = useFestivalStore((state) => state.festivals);
  const addPlay = usePlayStore((state) => state.addPlay);
  const updatePlay = usePlayStore((state) => state.updatePlay);

  const [isEditing, setIsEditing] = useState<boolean>(!Boolean(initialData));

  const toggleEdit = () => setIsEditing((current) => !current);

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();

  const locale = params.locale;

  const form = useForm<PlayFormValues>({
    resolver: zodResolver(playSchema),
    defaultValues: {
      ...initialData,

      // name: "قصة لا يرويها بطل",
      executorId: initialData?.director?.id || undefined,
      // posterImgUrl:
      //   "https://files.edgestore.dev/3c2duxoam1hwswve/publicFiles/_public/db580627-97e0-47e6-a2da-feaf8706a34a.jpg",
      showTime:
        (initialData &&
          new Date(new Date().getTime() + new Date(500000).getTime())) ||
        // new Date(
        //   "Wed Jan 31 2024 00:00:00 GMT+0200 (Eastern European Standard Time)"
        // ) ||
        undefined,
      festivalId: (initialData && "__") || undefined,
      // images: [
      //   "https://files.edgestore.dev/3c2duxoam1hwswve/publicFiles/_public/d98b6c9c-59c4-4d07-99d4-85871c662078.JPG",
      // ],
    },
  });

  const onSubmit = async (values: PlayFormValues) => {
    setIsLoading(true);
    startTransition(() => {
      if (initialData) {
        updatePlayRequest(values, initialData.id)
          .then((response) => response.json())
          .then(async (data) => {
            // console.log("api success");
            toast.success(
              t("messages.updated", {
                ns: "constants",
                instance: t("play.single", { ns: "constants" }),
              })
            );
            updatePlay(data);
            router.refresh();
            router.push(`/${locale}/admin/plays`);
          })
          .catch((error) => toast.error("something went wrong"))
          .finally(() => {
            setIsLoading(false);
            setIsEditing(false);
          });
      } else {
        createPlayRequest(values)
          .then((response) => response.json())
          .then(async (data) => {
            toast.success(
              t("messages.created", {
                ns: "constants",
                instance: t("play.single", { ns: "constants" }),
              })
            );
            addPlay(data);
            router.refresh();
            router.push(`/${locale}/admin/plays`);
          })
          .catch((error) => toast.error("something went wrong"))
          .finally(() => setIsLoading(false));
      }
    });
  };

  // const description = initialData
  //   ? `Edit ${initialData.name} play`
  //   : "Add a new billboard";

  const submitBtn = initialData
    ? t("save.default", { ns: "constants" })
    : t("create.default", { ns: "constants" });
  const submitingText = initialData
    ? `${t("save.loading", { ns: "constants" })}...`
    : `${t("create.loading", { ns: "constants" })}...`;

  const isSubmitting = isPending || form.formState.isSubmitting || isLoading;
  const isDisabled = isUploadingFile || isSubmitting;
  return (
    <div className={cn(initialData && "mt-6 border rounded-md p-4")}>
      {initialData && (
        <>
          <div className="font-medium flex items-center justify-between">
            <span className="capitalize">
              {t("playForm.titleText", { ns: "admin" })}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={toggleEdit}
                    variant="ghost"
                    className="capitalize"
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4 md:ltr:mr-2 md:rtl:ml-2 text-destructive dark:text-red-500" />
                        <span className="hidden md:inline-block">
                          {t("actions.cancel", { ns: "common" })}
                        </span>
                      </>
                    ) : (
                      <>
                        <Pencil className="h-4 w-4 md:ltr:mr-2 md:rtl:ml-2" />
                        <span className="hidden md:inline-block">
                          {t("actions.edit", {
                            instance: t("playForm.title", { ns: "admin" }),
                            ns: "common",
                          })}
                        </span>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>
                    {t("actions.edit", {
                      instance: t("playForm.title", { ns: "admin" }),
                      ns: "common",
                    })}
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Separator className="my-2" />
        </>
      )}

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData && "text-slate-500 italic"
          )}
        >
          {initialData ? initialData.name : t("actorForm.inputs-default.name")}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <div className="grid sm:grid-cols-2 md:grid-cols-3  gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("playForm.inputs-label.name", { ns: "admin" })}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isDisabled}
                        placeholder={t("playForm.inputs-placeholder.name", {
                          ns: "admin",
                        })}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="executorId"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <FormLabel>
                      {t("playForm.inputs-label.director", { ns: "admin" })}
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
                              ? localExecutors?.find(
                                  (executor) => executor.id === field.value
                                )?.name
                              : t("actions.select", {
                                  ns: "common",
                                  instance: t("executor.single", {
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
                              instance: t("executor.single", {
                                ns: "constants",
                              }),
                            })}
                          />
                          <CommandEmpty>
                            {t("notFound", {
                              ns: "constants",
                              instance: t("executor.single", {
                                ns: "constants",
                              }),
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {localExecutors?.map((executor) => (
                              <CommandItem
                                value={executor.id}
                                key={executor.id}
                                onSelect={() => {
                                  form.setValue("executorId", executor.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    executor.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {executor.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          <Separator />
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                onOpen("createExecutor");
                              }}
                            >
                              <PlusCircle
                                className={cn(
                                  "ltr:mr-2 rtl:ml-2 h-4 w-4 text-emerald-600"
                                )}
                              />
                              {t("actions.create", {
                                ns: "common",
                                instance: t("executor.single", {
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
              {!initialData && (
                <>
                  <FormField
                    control={form.control}
                    name="festivalId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-end">
                        <FormLabel>
                          {t("playForm.inputs-label.festival", { ns: "admin" })}
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
                                {localFestivals?.map((festival) => (
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

                  <FormField
                    control={form.control}
                    name="showTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-end">
                        <FormLabel>
                          {t("playForm.inputs-label.showTime", { ns: "admin" })}
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start  font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>
                                    {t("playForm.inputs-placeholder.showTime", {
                                      ns: "admin",
                                    })}
                                  </span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                            <Select
                              disabled={isDisabled}
                              onValueChange={(value) => {
                                form.setValue(
                                  "showTime",
                                  addDays(new Date(), parseInt(value))
                                );
                                form.trigger("showTime");
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="0">Today</SelectItem>
                                <SelectItem value="1">Tomorrow</SelectItem>
                                <SelectItem value="3">In 3 days</SelectItem>
                                <SelectItem value="7">In a week</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="rounded-md border">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(value) => {
                                  field.onChange(value);
                                  // if (!value) return;
                                  // if (new Date(value) < new Date()) {
                                  //   form.setError("showTime", {
                                  //     message: "The date must be a future date.",
                                  //   });
                                  //   return;
                                  // }
                                  // form.setValue("showTime", value);
                                  // form.trigger("showTime");
                                }}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            <Separator />
            <div className="grid md:grid-cols-3 gap-8 w-full">
              <FormField
                control={form.control}
                name="posterImgUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("playForm.inputs-label.poster", {
                        ns: "admin",
                      })}
                    </FormLabel>
                    <FormControl>
                      {/* <SingleImageUpload
                    // disabled={isSubmitting}
                    value={field.value ? field.value : ""}
                    setImageUrl={(url) => {
                      // console.log(url);
                      form.setValue(field.name, url);
                      form.trigger(field.name);
                      // console.log(form.getFieldState("posterImgUrl"));
                    }}
                    onLoading={setIsUploadingFile}
                    //   onRemove={() => field.onChange("")}
                    // {...field}
                  /> */}
                      <FileUpload
                        endpoint="playImage"
                        value={field.value}
                        onChange={field.onChange}
                        className="w-40 h-72"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("playForm.inputs-label.videoUrl", {
                          ns: "admin",
                        })}
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isDisabled}
                          placeholder={t(
                            "playForm.inputs-placeholder.videoUrl",
                            {
                              ns: "admin",
                            }
                          )}
                          // {...field}
                          onChange={(e) => {
                            const { value } = e.target;
                            const embedLink = extractEmbedLink(value);
                            form.setValue("videoUrl", embedLink || value);
                            form.trigger("videoUrl");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.getValues().videoUrl && (
                  <div className="max-w-full">
                    <iframe
                      title="video"
                      src={form.getValues().videoUrl || ""}
                    ></iframe>
                  </div>
                )}
              </div>
            </div>
            {/* <Separator />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("playForm.inputs-label.images", {
                  ns: "admin",
                })}
              </FormLabel>
              <FormControl>
                <MultiImageUpload
                  // disabled={isSubmitting}
                  value={field.value ? [...field.value] : []}
                  setImageUrls={(urls) => form.setValue(field.name, urls)}
                  //   onRemove={() => field.onChange("")}
                  // {...field}
                /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
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
      )}
    </div>
  );
};

export default PlayForm;
