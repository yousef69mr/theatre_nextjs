import { ActorInPlayType, FestivalType, PlayFestivalType } from "@/types";
import { create } from "zustand";


interface FestivalStore {
  festivals: null | FestivalType[];
  setFestivals(festivals: FestivalType[]): void;
  addFestival: (festival: FestivalType) => void;
  updateFestival: (festival: FestivalType) => void;
  removeFestival: (festivalId: string) => void;
  updateFestivalActors: (actorInPlay: ActorInPlayType) => void;
  removeFestivalActors: (actorInPlayId: string, festivalId: string) => void;
  updateFestivalPlays: (festivalPlay: PlayFestivalType) => void;
  removeFestivalPlays: (festivalPlayId: string, festivalId: string) => void;
}

export const useFestivalStore = create<FestivalStore>((set) => ({
  festivals: null,
  setFestivals: (festivals: FestivalType[]) => set({ festivals }),
  addFestival: (festival: FestivalType) =>
    set((state) => {
      return {
        festivals: state.festivals
          ? [...state.festivals, festival]
          : [festival],
      };
    }),
  updateFestival: (festival: FestivalType) =>
    set((state) => {
      const filteredFestivals = state.festivals?.filter(
        (temp) => temp.id !== festival.id
      );
      return {
        festivals: filteredFestivals
          ? [...filteredFestivals, festival]
          : [festival],
      };
    }),
  removeFestival: (festivalId: string) =>
    set((state) => {
      const filteredFestivals = state.festivals?.filter(
        (festival) => festival.id !== festivalId
      );
      return {
        festivals: filteredFestivals || [],
      };
    }),
  updateFestivalActors: (actorInPlay: ActorInPlayType) =>
    set((state) => {
      const selectedFestival = state.festivals?.find(
        (festival) => actorInPlay.festival.id === festival.id
      );
      if (!selectedFestival) return state;

      const filteredActors = selectedFestival.actors.filter(
        (actor) => actor.id !== actorInPlay.id
      );

      const updatedActors = [...filteredActors, actorInPlay];

      const updatedFestival = { ...selectedFestival, actors: updatedActors };
      state.updateFestival(updatedFestival);
      return state;
    }),
  removeFestivalActors: (actorInPlayId: string, festivalId: string) =>
    set((state) => {
      const selectedFestival = state.festivals?.find(
        (festival) => festivalId === festival.id
      );
      if (!selectedFestival) return state;

      const filteredActors = selectedFestival.actors.filter(
        (actor) => actor.id !== actorInPlayId
      );
      const updatedFestival = { ...selectedFestival, actors: filteredActors };
      state.updateFestival(updatedFestival);
      return state;
    }),
  updateFestivalPlays: (festivalPlay: PlayFestivalType) =>
    set((state) => {
      const selectedFestival = state.festivals?.find(
        (festival) => festivalPlay.festival.id === festival.id
      );
      if (!selectedFestival) return state;

      const filteredPlays = selectedFestival.plays.filter(
        (play) => play.id !== festivalPlay.id
      );

      const updatedPlays = [...filteredPlays, festivalPlay];

      const updatedFestival = { ...selectedFestival, plays: updatedPlays };
      state.updateFestival(updatedFestival);
      return state;
    }),
  removeFestivalPlays: (festivalPlayId: string, festivalId: string) =>
    set((state) => {
      const selectedFestival = state.festivals?.find(
        (festival) => festivalId === festival.id
      );
      if (!selectedFestival) return state;

      const filteredPlays = selectedFestival.plays.filter(
        (play) => play.id !== festivalPlayId
      );
      const updatedFestival = { ...selectedFestival, plays: filteredPlays };
      state.updateFestival(updatedFestival);
      return state;
    }),
}));
