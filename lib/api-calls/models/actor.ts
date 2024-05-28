import { permisionsSchema } from "@/lib/validations";
import { actorSchema } from "@/lib/validations/models/actor";
import { PUBLIC_DOMAIN } from "@/routes";

export const getAllActorsRequest = async () => {
  try {
    const promise = await fetch(PUBLIC_DOMAIN.concat("/api/actors"), {
      method: "GET",
      cache: "no-store",
    });
    // console.log(promise);
    const response = await promise.json();

    if (!promise.ok) {
      throw Error(response["error"]);
    }
    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getActorByIdRequest = async (
  actorId: string,
  options?: { viewIncrement?: boolean }
) => {
  const searchParams = new URLSearchParams();
  options?.viewIncrement &&
    searchParams.append("viewIncrement", options.viewIncrement.toString());
  try {
    const promise = await fetch(
      PUBLIC_DOMAIN.concat(`/api/actors/${actorId}?${searchParams.toString()}`),
      {
        method: "GET",
        cache: "no-store",
      }
    );
    const response = await promise.json();

    if (!promise.ok) {
      throw Error(response["error"]);
    }
    return response;
  } catch (error) {
    return null;
  }
};

export const createActorRequest = async (
  values: Zod.infer<typeof actorSchema>
) => {
  const promise = await fetch(PUBLIC_DOMAIN.concat("/api/actors"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...values }),
  });
  const response = await promise.json();

  if (!promise.ok) {
    throw Error(response["error"]);
  }
  return response;
};

export const updateActorRequest = async (
  values: Zod.infer<typeof actorSchema>,
  actorId: string
) => {
  // try {
  // console.log(values);
  const promise = await fetch(PUBLIC_DOMAIN.concat(`/api/actors/${actorId}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
    cache: "no-store",
  });
  const response = await promise.json();

  if (!promise.ok) {
    throw Error(response["error"]);
  }
  return response;
};
