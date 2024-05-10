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
    const response = await promise.json();

    if (!promise.ok) {
      // console.log(response["error"]);
      throw Error(response["error"]);
    }
    return response;
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
    const response = await promise.json();

    if (!promise.ok) {
      // console.log(response["error"]);
      throw Error(response["error"]);
    }
    return response;
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
  const response = await promise.json();

  if (!promise.ok) {
    // console.log(response["error"]);
    throw Error(response["error"]);
  }
  return response;
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
  const response = await promise.json();

  if (!promise.ok) {
    // console.log(response["error"]);
    throw Error(response["error"]);
  }
  return response;
};

export const getNotScanedTicketsRequest = async ({
  playId,
  festivalId,
}: {
  playId?: string | null;
  festivalId?: string | null;
}) => {
  const searchParams = new URLSearchParams();
  searchParams.append("isScanned", "false");
  playId && searchParams.append("playId", playId);
  festivalId && searchParams.append("festivalId", festivalId);

  try {
    const promise = await fetch(
      PUBLIC_DOMAIN.concat(`/api/tickets?${searchParams.toString()}`),
      {
        method: "GET",
        cache: "no-store",
      }
    );
    // console.log(promise);
    const response = await promise.json();

    if (!promise.ok) {
      // console.log(response["error"]);
      throw Error(response["error"]);
    }
    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
};
