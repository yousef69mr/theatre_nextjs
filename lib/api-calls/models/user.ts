import { playSchema } from "@/lib/validations/models/play";
import { PUBLIC_DOMAIN } from "@/routes";

export const getAllUsersRequest = async () => {
  try {
    const promise = await fetch(PUBLIC_DOMAIN.concat("/api/users"), {
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

export const getUserByIdRequest = async (playId: string) => {
  // if
  try {
    // console.log(playId);
    const promise = await fetch(PUBLIC_DOMAIN.concat(`/api/plays/${playId}`), {
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
    return null;
  }
};

export const createUserRequest = async (
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
  const response = await promise.json();

  if (!promise.ok) {
    // console.log(response["error"]);
    throw Error(response["error"]);
  }
  return response;
};

export const updateUserRequest = async (
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
  const response = await promise.json();

  if (!promise.ok) {
    // console.log(response["error"]);
    throw Error(response["error"]);
  }
  return response;
};
