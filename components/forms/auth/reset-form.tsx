"use client";

import { useState, useTransition } from "react";
import { resetSchema } from "@/lib/validations/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { resetRequest } from "@/lib/api-calls/auth/reset";
import { AxiosError } from "axios";
// import { reset } from "@/lib/actions/reset";

type resetValues = Zod.infer<typeof resetSchema>;

const ResetForm = () => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<Zod.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: resetValues) => {
    // console.log("Submitted", values);
    setError("");
    setSuccess("");

    startTransition(() => {
      //api call
      resetRequest(values)
        .then((response) => response.data)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        })
        .catch((error: AxiosError) => {
          if (
            // error.response &&
            error.response?.data &&
            typeof error.response.data === "object"
          ) {
            setError(Object.values(error.response?.data)[0]);
          } else {
            setError("Something went wrong!");
          }
        });

      //server action
      // reset(values).then((data) => {
      //   setError(data?.error);
      //   setSuccess(data?.success);
      // });
    });
  };

  const isSubmitting = form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    disabled={isSubmitting || isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          disabled={isSubmitting || isPending}
          type="submit"
          className="w-full"
        >
          Send reset email
        </Button>
      </form>
    </Form>
  );
};

export default ResetForm;
