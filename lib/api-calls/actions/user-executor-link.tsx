import { userExecutorLinkSchema } from "@/lib/validations/actions/link-model-actions";
import { PUBLIC_DOMAIN } from "@/routes";

export const getRemainingUserExecutorLinkRequest = async (
  key: "executor" | "user"
) => {
  const promise = await fetch(
    PUBLIC_DOMAIN.concat(`/api/user-executor-link?remaining=${key}`),
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

export const createUserExecutorLinkRequest = async (
  values: Zod.infer<typeof userExecutorLinkSchema>
) => {
  const promise = await fetch(PUBLIC_DOMAIN.concat(`/api/user-executor-link`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  // console.log(promise);
  const response = await promise.json();

    if (!promise.ok) {
      throw Error(response["error"]);
    }
    return response;
};

export const deleteUserExecutorLinkRequest = async (
  userExecutorLinkId: string,
  values: {
    userId: string;
    executorId: string;
  }
) => {
  const promise = await fetch(
    PUBLIC_DOMAIN.concat(`/api/user-executor-link/${userExecutorLinkId}`),
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
