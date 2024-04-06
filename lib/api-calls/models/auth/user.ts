import { registerSchema } from "@/lib/validations/auth";
import { PUBLIC_DOMAIN } from "@/routes";

export const getUserByIdRequest = async (userId: string) => {
  try {
    const promise = await fetch(PUBLIC_DOMAIN.concat(`/api/users/${userId}`), {
      method: "GET",
      cache: "no-store",
    });
    if (!promise.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }

    return promise.json();
  } catch (error) {
    return null;
  }
};

export const deleteUserByIdRequest = async (userId: string) => {
  try {
    const promise = await fetch(PUBLIC_DOMAIN.concat(`/api/users/${userId}`), {
      method: "DELETE",
      cache: "no-store",
    });
    if (!promise.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to delete data");
    }

    return promise.json();
  } catch (error) {
    return null;
  }
};

export const createUserRequest = async (
  values: Zod.infer<typeof registerSchema>
) => {
  const promise = await fetch(PUBLIC_DOMAIN.concat("/api/users"), {
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

export const updateUserRequest = async (
  values: Zod.infer<typeof registerSchema>,
  userId: string
) => {
  // try {
  // console.log(values);
  const promise = await fetch(PUBLIC_DOMAIN.concat(`/api/users/${userId}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
    cache: "no-store",
  });
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
