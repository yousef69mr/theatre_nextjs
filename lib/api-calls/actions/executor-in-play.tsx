import { executorInPlaySchema } from "@/lib/validations/actions/link-model-actions";
import { PUBLIC_DOMAIN } from "@/routes";

export const createExecutorInPlayRequest = async (
  values: Zod.infer<typeof executorInPlaySchema>
) => {
  const promise = await fetch(PUBLIC_DOMAIN.concat(`/api/play-executors`), {
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

export const updateExecutorInPlayRequest = async (
  values: Zod.infer<typeof executorInPlaySchema>,
  executorInPlayId: string
) => {
  const promise = await fetch(
    PUBLIC_DOMAIN.concat(`/api/play-executors/${executorInPlayId}`),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );
  // console.log(promise);
  const response = await promise.json();

    if (!promise.ok) {
      throw Error(response["error"]);
    }
    return response;
};
