"use client"

import { ticketSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

const AttendPlayForm = () => {
  const params = useParams()
  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
 
  const locale = params.locale;

  const form = useForm<Zod.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      // email: "",
      // password: "",
    },
  });

  const onSubmit=()=>{
    setError("");
    setSuccess("");

    startTransition(() => {
      //api call
      // attend(values, token)
      //   .then((response) => response.data)
      //   .then((data) => {
      //     setError(data?.error);
      //     setSuccess(data?.success);
      //   })
      //   .catch((error: AxiosError) => {
      //     if (
      //       // error.response &&
      //       error.response?.data &&
      //       typeof error.response.data === "object"
      //     ) {
      //       setError(Object.values(error.response?.data)[0]);
      //     } else {
      //       setError("Something went wrong");
      //     }
        });
  }
  return (
    <div>AttendPlayForm</div>
  )
}

export default AttendPlayForm