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
    return promise.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getActorByIdRequest = async (actorId: string) => {
  try {
  const promise = await fetch(PUBLIC_DOMAIN.concat(`/api/actors/${actorId}`), {
    method: "GET",
    cache: "no-store",
  });
  if (!promise.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return promise.json();
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
  // console.log(promise);
  if (!promise.ok) {
    throw Error(promise.statusText);
  }
  return promise;
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
  console.log(promise);
  if (!promise.ok) {
    throw Error(promise.statusText);
  }
  return promise;
  // } catch (error) {
  //   toast.error(error as string);
  //   return error;
  // }
};
