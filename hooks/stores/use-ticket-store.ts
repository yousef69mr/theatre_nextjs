import { TicketType, CastMemberType } from "@/types";
import { create } from "zustand";

// export type ModalType = "createTicket";

interface TicketStore {
  tickets: TicketType[] | null;
  setTickets(tickets: TicketType[]): void;
  addTickets: (ticket: TicketType[]) => void;
  updateTickets: (ticket: TicketType[]) => void;
  updateTicket: (ticket: TicketType) => void;
  removeTicket: (ticketId: string) => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
  tickets: null,
  setTickets: (tickets: TicketType[]) => set({ tickets }),
  addTickets: (tickets: TicketType[]) =>
    set((state) => {
      const filteredTickets = state.tickets ? state.tickets : [];
      return {
        tickets: [...filteredTickets, ...tickets],
      };
    }),
  updateTickets: (tickets: TicketType[]) =>
    set((state) => {
      const addedTicketsId: string[] = tickets.map((ticket) => ticket.id);

      const filteredTickets = state.tickets
        ? state.tickets.filter((ticket) => addedTicketsId.includes(ticket.id))
        : [];
      return {
        tickets: [...filteredTickets, ...tickets],
      };
    }),
  updateTicket: (ticket: TicketType) =>
    set((state) => {
      const filteredTickets = state.tickets?.filter(
        (temp) => temp.id !== ticket.id
      );
      return {
        tickets: filteredTickets ? [...filteredTickets, ticket] : [ticket],
      };
    }),
  removeTicket: (ticketId: string) =>
    set((state) => {
      const filteredTickets = state.tickets?.filter(
        (ticket) => ticket.id !== ticketId
      );
      return {
        tickets: filteredTickets || [],
      };
    }),
}));
