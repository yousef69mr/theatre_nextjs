import { bookPlayTicketsSchema } from "@/lib/validations/actions/book-ticket-action";
import { PUBLIC_DOMAIN } from "@/routes";

export const bookPlayTicketsRequest = async (
  values: Zod.infer<typeof bookPlayTicketsSchema>
) => {
  const promise = await fetch(PUBLIC_DOMAIN.concat(`/api/play-tickets`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  // console.log(promise);

  const response = await promise.json();
  // console.log(promise.ok);
  if (!promise.ok) {
    // console.log(response["error"]);
    throw Error(response["error"]);
  }
  return response;
};
