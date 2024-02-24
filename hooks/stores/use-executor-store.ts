import { ExecutorType } from "@/types";
import { set } from "date-fns";
import { create } from "zustand";

// export type ModalType = "createExecutor";

interface ExecutorStore {
  executors: null | ExecutorType[];
  setExecutors(executors: ExecutorType[]): void;
  addExecutor: (executor: ExecutorType) => void;
  updateExecutor: (executor: ExecutorType) => void;
  removeExecutor: (executorId: string) => void;
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
}));
