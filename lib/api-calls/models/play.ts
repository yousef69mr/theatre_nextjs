import { playSchema } from "@/lib/validations/models/play";
import { PUBLIC_DOMAIN } from "@/routes";

export const getAllPlaysRequest = async () => {
  try {
    const promise = await fetch(PUBLIC_DOMAIN.concat("/api/plays"), {
      method: "GET",
      cache: "no-store",
    });
    if (!promise.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }

    return promise.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getPlayByIdRequest = async (playId: string) => {
  // if
  try {
    // console.log(playId);
    const promise = await fetch(PUBLIC_DOMAIN.concat(`/api/plays/${playId}`), {
      method: "GET",
      cache: "no-store",
    });
    if (!promise.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }
    // console.log(promise);
    return promise.json();
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
  // console.log(promise);
  if (!promise.ok) {
    throw Error(promise.statusText);
  }
  return promise;
  // } catch (error) {
  //   toast.error(error as string);
  //   return error;
  // }
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
  // console.log(promise);
  if (!promise.ok) {
    throw Error(promise.statusText);
  }
  return promise;
  // } catch (error) {
  //   toast.error(error as string);
  //   return error;
  // }
};
