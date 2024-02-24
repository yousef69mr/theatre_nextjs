import { ActorInPlayType, ActorType } from "@/types";
import { create } from "zustand";

// export type ModalType = "createActor";

interface ActorStore {
  actors: ActorType[] | null;
  setActors(actors: ActorType[]): void;
  addActor: (actor: ActorType) => void;
  updateActor: (actor: ActorType) => void;
  removeActor: (actorId: string) => void;
  updateActorPlays: (actorInPlay: ActorInPlayType) => void;
  removeActorPlays: (actorInPlayId: string, actorId: string) => void;
}

export const useActorStore = create<ActorStore>((set) => ({
  actors: null,
  setActors: (actors: ActorType[]) => set({ actors }),
  addActor: (actor: ActorType) =>
    set((state) => {
      return {
        actors: state.actors ? [...state.actors, actor] : [actor],
      };
    }),
  updateActor: (actor: ActorType) =>
    set((state) => {
      const filteredActors = state.actors?.filter(
        (temp) => temp.id !== actor.id
      );
      return {
        actors: filteredActors ? [...filteredActors, actor] : [actor],
      };
    }),
  updateActorPlays: (actorInPlay: ActorInPlayType) =>
    set((state) => {
      const selectedActor = state.actors?.find(
        (actor) => actorInPlay.actor.id === actor.id
      );
      if (!selectedActor) return state;

      const filteredPlay = selectedActor.plays.filter(
        (play) => play.id !== actorInPlay.id
      );

      const updatedPlays = [...filteredPlay, actorInPlay];

      const updatedActor = { ...selectedActor, plays: updatedPlays };
      state.updateActor(updatedActor);
      return state;
    }),
  removeActorPlays: (actorInPlayId: string, actorId: string) =>
    set((state) => {
      const selectedActor = state.actors?.find((actor) => actorId === actor.id);
      if (!selectedActor) return state;

      const filteredPlay = selectedActor.plays.filter(
        (play) => play.id !== actorInPlayId
      );

      const updatedActor = { ...selectedActor, plays: filteredPlay };
      state.updateActor(updatedActor);
      return state;
    }),
  removeActor: (actorId: string) =>
    set((state) => {
      const filteredActors = state.actors?.filter(
        (actor) => actor.id !== actorId
      );
      return {
        actors: filteredActors || [],
      };
    }),
}));
