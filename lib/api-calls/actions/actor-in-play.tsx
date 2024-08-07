import { actorInPlaySchema } from "@/lib/validations/actions/link-model-actions";
import { PUBLIC_DOMAIN } from "@/routes";

export const createActorInPlayRequest = async (
  values: Zod.infer<typeof actorInPlaySchema>
) => {
  const promise = await fetch(PUBLIC_DOMAIN.concat(`/api/play-actors`), {
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

export const updateActorInPlayRequest = async (
  values: Zod.infer<typeof actorInPlaySchema>,
  actorInPlayId: string
) => {
  const promise = await fetch(
    PUBLIC_DOMAIN.concat(`/api/play-actors/${actorInPlayId}`),
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
