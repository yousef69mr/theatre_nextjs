import {
  ActorInPlayType,
  ActorType,
  CastMemberType,
  ExecutorInPlayType,
  ExecutorType,
  FestivalType,
  PlayFestivalType,
  PlayType,
  TicketType,
  UserActorLinkType,
  UserExecutorLinkType,
  UserType,
} from "@/types";
import { create } from "zustand";

export type ModalType =
  // | "createPlay"

  | "deletePlay"
  | "scanTicket"
  | "showBookedTickets"
  | "shareTicket"
  | "deleteTicket"
  | "editTicket"
  | "deleteUser"
  | "createExecutor"
  | "deleteExecutor"
  | "createActor"
  | "deleteActor"
  | "createFestival"
  | "linkActorPlay"
  | "deleteActorPlayLink"
  | "linkExecutorPlay"
  | "deleteExecutorPlayLink"
  | "linkFestivalPlay"
  | "deleteFestivalPlayLink"
  | "linkCastMember"
  | "deleteCastMember"
  | "linkExecutorPlay"
  | "linkUserActor"
  | "deleteUserActorLink"
  | "linkUserExecutor"
  | "deleteUserExecutorLink"
  | "editUserRole";

interface ModalData {
  tickets?: TicketType[];
  ticket?: TicketType;
  user?: UserType;
  userActorLink?: UserActorLinkType;
  userExecutorLink?: UserExecutorLinkType;
  castMember?: CastMemberType;
  festival?: FestivalType;
  play?: PlayType;
  executor?: ExecutorType;
  executorInPlay?: ExecutorInPlayType;
  actorInPlay?: ActorInPlayType;
  festivalPlay?: PlayFestivalType;
  actor?: ActorType;
  apiUrl?: string;
  query?: Record<string, any>;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
