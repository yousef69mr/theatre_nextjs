import { bookPlayTicketsSchema } from "@/lib/validations/actions/book-ticket-action";
import { PUBLIC_DOMAIN } from "@/routes";

export const createPlayTicketsRequest = async (
  values: Zod.infer<typeof bookPlayTicketsSchema>
) => {
  const promise = await fetch(PUBLIC_DOMAIN.concat(`/api/play-actors`), {
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

