"use client";

// import { newVerification } from "@/lib/actions/new-verification";
import { redirect, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { newVerificationRequest } from "@/lib/api-calls/new-verification";

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) {
      return;
    }

    if (!token) {
      return setError("Missing token!");
    }

    //api call
    newVerificationRequest(token)
      .then((response) => response.data)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => setError("Something went wrong!"));
      
    //server action
    // newVerification(token)
    //   .then((data) => {
    //     setSuccess(data.success);
    //     setError(data.error);
    //   })
    //   .catch(() => setError("Something went wrong!"));
  }, [success, error, token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  useEffect(() => {
    if (success) {
      const timeoutId = setTimeout(() => redirect("/auth/login"), 1000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [success]);
  return (
    <div className="flex justify-center items-center w-full">
      {!error && !success && <BeatLoader />}
      <FormSuccess message={success} />
      {!success && <FormError message={error} />}
    </div>
  );
};

export default NewVerificationForm;
