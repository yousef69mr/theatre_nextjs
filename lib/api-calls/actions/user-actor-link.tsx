import { userActorLinkSchema } from "@/lib/validations/actions/link-model-actions";
import { PUBLIC_DOMAIN } from "@/routes";

export const getRemainingUserActorLinkRequest = async (
  key: "actor" | "user"
) => {
  const promise = await fetch(
    PUBLIC_DOMAIN.concat(`/api/user-actor-link?remaining=${key}`),
    {
      method: "GET",
    }
  );
  const response = await promise.json();

  if (!promise.ok) {
    throw Error(response["error"]);
  }
  return response;
};

export const createUserActorLinkRequest = async (
  values: Zod.infer<typeof userActorLinkSchema>
) => {
  const promise = await fetch(PUBLIC_DOMAIN.concat(`/api/user-actor-link`), {
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

export const deleteUserActorLinkRequest = async (
  userActorLinkId: string,
  values: {
    userId: string;
    actorId: string;
  }
) => {
  const promise = await fetch(
    PUBLIC_DOMAIN.concat(`/api/user-actor-link/${userActorLinkId}`),
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
      }),
    }
  );
  const response = await promise.json();

  if (!promise.ok) {
    throw Error(response["error"]);
  }
  return response;
};
