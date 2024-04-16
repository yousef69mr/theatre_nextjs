import { castMemberSchema } from "@/lib/validations/models/cast-member";
import { PUBLIC_DOMAIN } from "@/routes";

export const getCastMemberByIdRequest = async (castMemberId: string) => {
  try {
    const promise = await fetch(
      PUBLIC_DOMAIN.concat(`/api/cast-members/${castMemberId}`),
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

export const createCastMemberRequest = async (
  values: Zod.infer<typeof castMemberSchema>
) => {
  const promise = await fetch(PUBLIC_DOMAIN.concat("/api/cast-members"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...values }),
  });
  // console.log(promise);
  const response = await promise.json();

  if (!promise.ok) {
    throw Error(response["error"]);
  }
  return response;
};

export const updateCastMemberRequest = async (
  values: Zod.infer<typeof castMemberSchema>,
  castMemberId: string
) => {
  // try {
  // console.log(values);
  const promise = await fetch(
    PUBLIC_DOMAIN.concat(`/api/cast-members/${castMemberId}`),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
      cache: "no-store",
    }
  );
  const response = await promise.json();

  if (!promise.ok) {
    throw Error(response["error"]);
  }
  return response;
};
