import { create } from "zustand";

const useUserStore = create((set) => ({
    user: null,
    setUser: (userData) => {
        sessionStorage.setItem("user", JSON.stringify(userData));
        set({ user: userData });
    },
    logout: async () => {
        try {
            sessionStorage.removeItem("user");
            set({ user: null });
        } catch (error) {
            console.error("Error signing out:", error);
        }
    },
}));

export default useUserStore;