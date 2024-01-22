"use client";

import { loginSchema } from "@/lib/validations/index";
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
import FormError from "./form-error";
import FormSuccess from "./form-success";
// import { loginRequest } from "@/lib/api-calls/login";
import { useState, useTransition } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/actions/login";

type loginValues = Zod.infer<typeof loginSchema>;

const LoginForm = () => {
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");

  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with diffrent provider"
      : "";

  const locale = params.locale;

  const form = useForm<Zod.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: loginValues) => {
    // console.log("Submitted", values);
    setError("");
    setSuccess("");

    startTransition(() => {
      // if (process.env.NEXT_DATA_TRANSITION_MODE !== "serverAction") {
      //   loginRequest(values)
      //     .then((response) => response.data)
      //     .then((data) => {
      //       if (data?.error) {
      //         // form.reset();
      //         setError(data?.error);
      //       }

      //       if (data?.success) {
      //         form.reset();
      //         setSuccess(data?.success);
      //       }

      //       if (data?.twoFactor) {
      //         setShowTwoFactor(true);
      //       }
      //     })

      //     .catch(() => setError("Something went!"));
      // } else {
        login(values)
          .then((data) => {
            if (data?.error) {
              // form.reset();
              setError(data?.error);
            }
            if (data?.success) {
              form.reset();
              setSuccess(data?.success);
            }
            if (data?.twoFactor) {
              setShowTwoFactor(true);
            }
          })
          .catch(() => setError("Something went wrong!"));
      // }
    });
  };

  const isSubmitting = form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {!showTwoFactor ? (
            <>
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
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        disabled={isSubmitting || isPending}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      className="px-0 font-normal"
                      size={"sm"}
                      asChild
                      variant={"link"}
                    >
                      <Link href={`/${locale}/auth/reset`}>
                        Forgot password ?
                      </Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      disabled={isSubmitting || isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <FormError message={error || urlError} />
        <FormSuccess message={success} />
        <Button
          disabled={isSubmitting || isPending}
          type="submit"
          className="w-full"
        >
          {showTwoFactor ? "Confirm" : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
