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
    if (!promise.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }

    return promise.json();
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
  if (!promise.ok) {
    throw Error(promise.statusText);
  }
  return promise;
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
