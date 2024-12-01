import { create } from "zustand";

const useSearchConfigsStore = create((set) => ({
    searchConfings: null, 
    setSearchConfigs: (data) => set({ searchConfings: data }),
}));

export default useSearchConfigsStore;