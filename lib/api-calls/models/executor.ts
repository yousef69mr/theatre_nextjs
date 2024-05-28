import { executorSchema } from "@/lib/validations/models/executor";
import { PUBLIC_DOMAIN } from "@/routes";

export const getAllExecutorsRequest = async () => {
  try {
    const promise = await fetch(PUBLIC_DOMAIN.concat("/api/executors"), {
      method: "GET",
      cache: "no-store",
    });
    // console.log(promise);
    return promise.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getExecutorByIdRequest = async (
  executorId: string,
  options?: { viewIncrement?: boolean }
) => {
  const searchParams = new URLSearchParams();
  options?.viewIncrement &&
    searchParams.append("viewIncrement", options.viewIncrement.toString());
  try {
    const promise = await fetch(
      PUBLIC_DOMAIN.concat(
        `/api/executors/${executorId}?${searchParams.toString()}`
      ),
      {
        method: "GET",
        cache: "no-store",
      }
    );
    if (!promise.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }

    return promise.json();
  } catch (error) {
    return null;
  }
};

export const createExecutorRequest = async (
  values: Zod.infer<typeof executorSchema>,
  pathname: string
) => {
  const promise = await fetch(PUBLIC_DOMAIN.concat("/api/executors"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...values, pathname }),
  });
  // console.log(promise);

  const reponse = await promise.json();
  // console.log(promise);
  if (!promise.ok) {
    // console.error();
    throw Error(reponse["error"]);
  }
  return reponse;
};

export const updateExecutorRequest = async (
  values: Zod.infer<typeof executorSchema>,
  executorId: string
) => {
  // try {
  console.log(values);
  const promise = await fetch(
    PUBLIC_DOMAIN.concat(`/api/executors/${executorId}`),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
      // cache: "no-store",
    }
  );
  const reponse = await promise.json();
  // console.log(promise);
  if (!promise.ok) {
    throw Error(reponse["error"]);
  }
  return reponse;
};
