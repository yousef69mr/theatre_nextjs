import { festivalPlaySchema } from "@/lib/validations/actions/link-model-actions";
import { PUBLIC_DOMAIN } from "@/routes";

export const createFestivalPlayRequest = async (
  values: Zod.infer<typeof festivalPlaySchema>
) => {
  const promise = await fetch(PUBLIC_DOMAIN.concat(`/api/play-festivals`), {
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

export const updateFestivalPlayRequest = async (
  values: Zod.infer<typeof festivalPlaySchema>,
  festivalPlayId: string
) => {
  const promise = await fetch(
    PUBLIC_DOMAIN.concat(`/api/play-festivals/${festivalPlayId}`),
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
