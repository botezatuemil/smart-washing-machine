import { create } from "zustand";

type LoginStatusType = {
  token: string;
  isLoggedIn: boolean;
  toggleLogin: (newState: boolean) => void;
  setToken: (token: string) => void;
};
export const useLoginStore = create<LoginStatusType>()((set) => ({
  token: "",
  isLoggedIn: false,
  toggleLogin: (newState: boolean) =>
    set((state) => ({ isLoggedIn: newState })),
  setToken: (token: string) => set((state) => ({ token: token })),
}));
