import { array, object, string } from "zod";

export const scanPlayTicketsSchema = object({
  ticketId: string().min(1, { message: "ticketId is required" }),
});
