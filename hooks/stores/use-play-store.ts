import { ActorInPlayType, PlayFestivalType, PlayType } from "@/types";
import { create } from "zustand";

// export type ModalType = "createActor";

interface PlayStore {
  plays: PlayType[] | null;
  setPlays(plays: PlayType[]): void;
  addPlay: (play: PlayType) => void;
  updatePlay: (play: PlayType) => void;
  removePlay: (actorId: string) => void;
  updatePlayActors: (actorInPlay: ActorInPlayType) => void;
  removePlayActors: (actorInPlayId: string, playId: string) => void;
  updatePlayFestivals: (festivalPlay: PlayFestivalType) => void;
  removePlayFestivals: (festivalPlayId: string, playId: string) => void;
}

export const usePlayStore = create<PlayStore>((set) => ({
  plays: null,
  setPlays: (plays: PlayType[]) => set({ plays }),
  addPlay: (play: PlayType) =>
    set((state) => {
      return {
        plays: state.plays ? [...state.plays, play] : [play],
      };
    }),
  updatePlay: (play: PlayType) =>
    set((state) => {
      const filteredPlays = state.plays?.filter((temp) => temp.id !== play.id);
      return {
        plays: filteredPlays ? [...filteredPlays, play] : [play],
      };
    }),
  removePlay: (playId: string) =>
    set((state) => {
      const filteredPlays = state.plays?.filter((play) => play.id !== playId);
      return {
        plays: filteredPlays || [],
      };
    }),
  updatePlayActors: (actorInPlay: ActorInPlayType) =>
    set((state) => {
      const selectedPlay = state.plays?.find(
        (play) => actorInPlay.play.id === play.id
      );
      if (!selectedPlay) return state;

      const filteredActors = selectedPlay.actors.filter(
        (actor) => actor.id !== actorInPlay.id
      );

      const updatedActors = [...filteredActors, actorInPlay];

      const updatedPlay = { ...selectedPlay, actors: updatedActors };
      state.updatePlay(updatedPlay);
      return state;
    }),
  removePlayActors: (actorInPlayId: string, playId: string) =>
    set((state) => {
      const selectedPlay = state.plays?.find((play) => playId === play.id);
      if (!selectedPlay) return state;

      const filteredActors = selectedPlay.actors.filter(
        (actor) => actor.id !== actorInPlayId
      );
      const updatedPlay = { ...selectedPlay, actors: filteredActors };
      state.updatePlay(updatedPlay);
      return state;
    }),
  updatePlayFestivals: (festivalPlay: PlayFestivalType) =>
    set((state) => {
      const selectedPlay = state.plays?.find(
        (play) => festivalPlay.play.id === play.id
      );
      if (!selectedPlay) return state;

      const filteredFestivals = selectedPlay.festivals.filter(
        (actor) => actor.id !== festivalPlay.id
      );

      const updatedFestivals = [...filteredFestivals, festivalPlay];

      const updatedPlay = { ...selectedPlay, festivals: updatedFestivals };
      state.updatePlay(updatedPlay);
      return state;
    }),
  removePlayFestivals: (festivalPlayId: string, playId: string) =>
    set((state) => {
      const selectedPlay = state.plays?.find((play) => playId === play.id);
      if (!selectedPlay) return state;

      const filteredFestivals = selectedPlay.festivals.filter(
        (festival) => festival.id !== festivalPlayId
      );
      const updatedPlay = { ...selectedPlay, festivals: filteredFestivals };
      state.updatePlay(updatedPlay);
      return state;
    }),
}));
