import { ExecutorInPlayType, ExecutorType } from "@/types";
import { create } from "zustand";

// export type ModalType = "createExecutor";

interface ExecutorStore {
  executors: null | ExecutorType[];
  setExecutors(executors: ExecutorType[]): void;
  addExecutor: (executor: ExecutorType) => void;
  updateExecutor: (executor: ExecutorType) => void;
  removeExecutor: (executorId: string) => void;
  updateExecutorPlays: (executorInPlay: ExecutorInPlayType) => void;
  removeExecutorPlays: (executorInPlayId: string, executorId: string) => void;
}

export const useExecutorStore = create<ExecutorStore>((set) => ({
  executors: null,
  setExecutors: (executors: ExecutorType[]) => set({ executors }),
  addExecutor: (executor: ExecutorType) =>
    set((state) => {
      return {
        executors: state.executors
          ? [...state.executors, executor]
          : [executor],
      };
    }),
  updateExecutor: (executor: ExecutorType) =>
    set((state) => {
      const filteredExecutors = state.executors?.filter(
        (temp) => temp.id !== executor.id
      );
      return {
        executors: filteredExecutors
          ? [...filteredExecutors, executor]
          : [executor],
      };
    }),
  removeExecutor: (executorId: string) =>
    set((state) => {
      const filteredExecutors = state.executors?.filter(
        (executor) => executor.id !== executorId
      );
      return {
        executors: filteredExecutors || [],
      };
    }),
  updateExecutorPlays: (executorInPlay: ExecutorInPlayType) =>
    set((state) => {
      const selectedExecutor = state.executors?.find(
        (executor) => executorInPlay.executor.id === executor.id
      );
      if (!selectedExecutor) return state;

      const filteredPlay = selectedExecutor.plays.filter(
        (play) => play.id !== executorInPlay.id
      );

      const updatedPlays = [...filteredPlay, executorInPlay];

      const updatedExecutor = { ...selectedExecutor, plays: updatedPlays };
      state.updateExecutor(updatedExecutor);
      return state;
    }),
  removeExecutorPlays: (executorInPlayId: string, executorId: string) =>
    set((state) => {
      const selectedExecutor = state.executors?.find(
        (executor) => executorId === executor.id
      );
      if (!selectedExecutor) return state;

      const filteredPlay = selectedExecutor.plays.filter(
        (play) => play.id !== executorInPlayId
      );

      const updatedExecutor = { ...selectedExecutor, plays: filteredPlay };
      state.updateExecutor(updatedExecutor);
      return state;
    }),
}));
