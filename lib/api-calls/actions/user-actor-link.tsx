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
  // console.log(promise);
  if (!promise.ok) {
    throw Error(promise.statusText);
  }
  return promise;
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
  // console.log(promise);
  if (!promise.ok) {
    throw Error(promise.statusText);
  }
  return promise;
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
  // console.log(promise);
  if (!promise.ok) {
    throw Error(promise.statusText);
  }
  return promise;
};
