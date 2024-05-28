import { playSchema } from "@/lib/validations/models/play";
import { PUBLIC_DOMAIN } from "@/routes";

export const getAllPlaysRequest = async () => {
  try {
    const promise = await fetch(PUBLIC_DOMAIN.concat("/api/plays"), {
      method: "GET",
      cache: "no-store",
    });
    const response = await promise.json();

    if (!promise.ok) {
      // console.log(response["error"]);
      throw Error(response["error"]);
    }
    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getPlayByIdRequest = async (
  playId: string,
  options?: { viewIncrement?: boolean }
) => {
  // if
  const searchParams = new URLSearchParams();
  options?.viewIncrement &&
    searchParams.append("viewIncrement", options.viewIncrement.toString());
  try {
    // console.log(playId);
    const promise = await fetch(
      PUBLIC_DOMAIN.concat(`/api/plays/${playId}?${searchParams.toString()}`),
      {
        method: "GET",
        cache: "no-store",
      }
    );
    const reponse = await promise.json();
    // console.log(promise);
    if (!promise.ok) {
      throw Error(reponse["error"]);
    }
    return reponse;
  } catch (error) {
    return null;
  }
};

export const createPlayRequest = async (
  values: Zod.infer<typeof playSchema>
) => {
  // try {
  // console.log(values);
  const promise = await fetch(PUBLIC_DOMAIN.concat("/api/plays"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  const reponse = await promise.json();
  // console.log(promise);
  if (!promise.ok) {
    throw Error(reponse["error"]);
  }
  return reponse;
};

export const updatePlayRequest = async (
  values: Zod.infer<typeof playSchema>,
  playId: string
) => {
  // try {
  // console.log(values);
  const promise = await fetch(PUBLIC_DOMAIN.concat(`/api/plays/${playId}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  const reponse = await promise.json();
  // console.log(promise);
  if (!promise.ok) {
    throw Error(reponse["error"]);
  }
  return reponse;
};
