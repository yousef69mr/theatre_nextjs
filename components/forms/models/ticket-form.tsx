"use client";

import { FC, HtmlHTMLAttributes, useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TicketType } from "@/types";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

// import { SingleImageUpload } from "@/components/helpers/single-image-upload";
import { Loader2, Pencil } from "lucide-react";

import toast from "react-hot-toast";

import { Separator } from "@/components/ui/separator";

import { useTranslation } from "react-i18next";

import { ticketSchema } from "@/lib/validations/models/ticket";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/stores/use-modal-store";
// import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import FileUpload from "@/components/helpers/file-upload";
import {
  createTicketRequest,
  updateTicketRequest,
} from "@/lib/api-calls/models/ticket";
import { useTicketStore } from "@/hooks/stores/use-ticket-store";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TicketFormProps extends HtmlHTMLAttributes<HTMLElement> {
  initialData: TicketType | null;
  mode?: "modal" | "page";
}

type TicketFormValues = Zod.infer<typeof ticketSchema>;
// const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const TicketForm: FC<TicketFormProps> = (props) => {
  const { initialData, className, mode = "page" } = props;
  const { onClose } = useModal();
  const addTicket = useTicketStore((state) => state.addTickets);
  const updateTicket = useTicketStore((state) => state.updateTicket);
  // console.log(initialData, Boolean(initialData));
  const [isEditing, setIsEditing] = useState<boolean>(
    !Boolean(initialData) || mode === "modal"
  );

  const toggleEdit = () => setIsEditing((current) => !current);

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const router = useRouter();
  const params = useParams();
  // const pathname = usePathname();

  const { t } = useTranslation();

  const locale = params.locale;

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      ...initialData,
      playId: initialData?.play.id || undefined,
      festivalId: initialData?.festival.id || undefined,
      // facultyCast: initialData?.facultyCast || undefined,
    },
  });

  const onSubmit = async (values: TicketFormValues) => {
    setIsLoading(true);

    startTransition(() => {
      if (initialData) {
        // setIsEditing(true);
        updateTicketRequest(values, initialData.id)
          // .then((response) => response.json())
          .then(async (data) => {
            // console.log("api success");
            toast.success(
              t("messages.updated", {
                ns: "constants",
                instance: t("ticket.single", { ns: "constants" }),
              })
            );

            updateTicket(data);
            router.refresh();

            if (mode === "page") {
              router.push(`/${locale}/admin/tickets`);
            } else {
              onClose();
              form.reset();
            }
          })
          .catch((error: Error) => {
            toast.error(error.message)
          })
          .finally(() => {
            setIsLoading(false);
            setIsEditing(false);
          });
      } else {
        createTicketRequest(values)
          // .then((response) => response.json())
          .then(async (data) => {
            toast.success(
              t("messages.created", {
                ns: "constants",
                instance: t("ticket.single", { ns: "constants" }),
              })
            );

            addTicket(data);
            router.refresh();

            if (mode === "page") {
              router.push(`/${locale}/admin/tickets`);
            } else {
              onClose();
              form.reset();
            }
          })
          .catch((error: Error) => {
            toast.error(error.message)
          })
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
  const isValid = form.formState.isValid;
  return (
    <div
      className={cn(
        initialData && mode !== "modal" && "mt-6 border rounded-md p-4"
      )}
    >
      {initialData && mode !== "modal" && (
        <>
          <div className="font-medium flex items-center justify-between">
            <span className="capitalize">
              {t("ticketForm.titleText", { ns: "admin" })}
            </span>
            <Button onClick={toggleEdit} variant="ghost" className="capitalize">
              {isEditing ? (
                <>{t("actions.cancel", { ns: "common" })}</>
              ) : (
                <>
                  <Pencil className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
                  {t("actions.edit", {
                    instance: t("ticketForm.title", { ns: "admin" }),
                    ns: "common",
                  })}
                </>
              )}
            </Button>
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
          {initialData
            ? `${initialData.guestName} ${`(${initialData.id})`}`
            : t("ticketForm.inputs-default.name")}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("flex flex-col w-full space-y-4", className)}
          >
            <div
              className={cn(
                "flex w-full flex-wrap",
                mode === "modal" && "flex-col items-center"
              )}
            >
              <div
                className={cn(
                  "gap-4 flex-1",
                  mode === "page" && "grid md:grid-cols-2 items-center",
                  mode === "modal" && "w-full"
                )}
              >
                <div
                  className={cn(
                    "w-full flex items-center justify-center flex-wrap gap-x-1",
                    mode === "page" && "md:col-span-2"
                  )}
                >
                  <FormField
                    control={form.control}
                    name="guestName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>
                          {t("forms.labels.guestName", { ns: "constants" })}
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isDisabled}
                            placeholder={t("forms.placeholder.guestName", {
                              ns: "constants",
                            })}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />
            <div className="flex w-full justify-end items-center">
              <Button type="submit" disabled={isDisabled || !isValid}>
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

export default TicketForm;
