import { festivalSchema } from "@/lib/validations/models/festival";
import { PUBLIC_DOMAIN } from "@/routes";

export const getAllFestivalsRequest = async () => {
  try {
    const promise = await fetch(PUBLIC_DOMAIN.concat("/api/festivals"), {
      method: "GET",
      cache: "no-store",
    });

    const response = await promise.json();

    if (!promise.ok) {
      throw Error(response["error"]);
    }
    return response;
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
    const response = await promise.json();

    if (!promise.ok) {
      throw Error(response["error"]);
    }
    return response;
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
  const response = await promise.json();

  if (!promise.ok) {
    throw Error(response["error"]);
  }
  return response;
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
  const response = await promise.json();

  if (!promise.ok) {
    throw Error(response["error"]);
  }
  return response;
};
