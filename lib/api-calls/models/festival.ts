import { festivalSchema } from "@/lib/validations/models/festival";
import { PUBLIC_DOMAIN } from "@/routes";

export const getAllFestivalsRequest = async () => {
  try {
    const promise = await fetch(PUBLIC_DOMAIN.concat("/api/festivals"), {
      method: "GET",
      cache: "no-store",
    });
    // console.log(promise);
    if (!promise.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }
    return await promise.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getFestivalByIdRequest = async (festivalId: string) => {
  try {
    const promise = await fetch(
      PUBLIC_DOMAIN.concat(`/api/festivals/${festivalId}`),
      {
        method: "GET",
        cache: "no-store",
      }
    );
    if (!promise.ok) {
      throw Error(promise.statusText);
    }
    return promise.json();
  } catch (error) {
    return null;
  }
};

export const createFestivalRequest = async (
  values: Zod.infer<typeof festivalSchema>
) => {
  const promise = await fetch(PUBLIC_DOMAIN.concat("/api/festivals"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  if (!promise.ok) {
    throw Error(promise.statusText);
  }
  return promise;
};

export const updateFestivalRequest = async (
  values: Zod.infer<typeof festivalSchema>,
  festivalId: string
) => {
  const promise = await fetch(
    PUBLIC_DOMAIN.concat(`/api/festivals/${festivalId}`),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );
  if (!promise.ok) {
    throw Error(promise.statusText);
  }
  return promise;
};
