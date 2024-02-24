"use client";

import { useState, useTransition } from "react";
import { newPasswordSchema } from "@/lib/validations/auth/index";
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
// import { newPassword } from "@/lib/actions/new-password";
import { useSearchParams } from "next/navigation";
import { newPasswordRequest } from "@/lib/api-calls/auth/new-password";
import { AxiosError } from "axios";

type newPasswordValues = Zod.infer<typeof newPasswordSchema>;

const NewPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const form = useForm<Zod.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: newPasswordValues) => {
    // console.log("Submitted", values);
    setError("");
    setSuccess("");

    startTransition(() => {
      //api call
      newPasswordRequest(values, token)
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
            setError("Something went wrong");
          }
        });

      //server action
      // newPassword(values, token).then((data) => {
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
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="******"
                    disabled={isSubmitting || isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="******"
                    disabled={isSubmitting || isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormMessage />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button
          disabled={isSubmitting || isPending}
          type="submit"
          className="w-full"
        >
          Reset password
        </Button>
      </form>
    </Form>
  );
};

export default NewPasswordForm;
