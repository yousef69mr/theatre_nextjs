import { ticketSchema } from "@/lib/validations/models/ticket";
import { PUBLIC_DOMAIN } from "@/routes";

export const getUserTicketsRequest = async (userId: String) => {
  try {
    const promise = await fetch(
      PUBLIC_DOMAIN.concat(`/api/users/${userId}/tickets`),
      {
        method: "GET",
        cache: "no-store",
      }
    );
    // console.log(promise);
    return promise.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllTicketsRequest = async () => {
  try {
    const promise = await fetch(PUBLIC_DOMAIN.concat("/api/tickets"), {
      method: "GET",
      cache: "no-store",
    });
    // console.log(promise);
    return promise.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getTicketByIdRequest = async (ticketId: string) => {
  try {
    const promise = await fetch(
      PUBLIC_DOMAIN.concat(`/api/tickets/${ticketId}`),
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

export const createTicketRequest = async (
  values: Zod.infer<typeof ticketSchema>
) => {
  const promise = await fetch(PUBLIC_DOMAIN.concat("/api/tickets"), {
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

export const updateTicketRequest = async (
  values: Zod.infer<typeof ticketSchema>,
  ticketId: string
) => {
  // try {
  // console.log(values);
  const promise = await fetch(
    PUBLIC_DOMAIN.concat(`/api/tickets/${ticketId}`),
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
