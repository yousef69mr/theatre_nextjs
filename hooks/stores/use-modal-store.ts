import {
  ActorInPlayType,
  ActorType,
  CastMemberType,
  ExecutorInPlayType,
  ExecutorType,
  FestivalType,
  PlayFestivalType,
  PlayType,
} from "@/types";
import { create } from "zustand";

export type ModalType =
  // | "createPlay"
  | "deletePlay"
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
  | "linkExecutorPlay";

interface ModalData {
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
