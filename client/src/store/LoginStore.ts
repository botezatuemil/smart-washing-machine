import { create } from 'zustand';

type LoginStatusType = {
    isLoggedIn : boolean,
    toggleLogin: (newState : boolean) => void;
}
export const useLoginStore = create<LoginStatusType>()((set) => ({
    isLoggedIn: false,
    toggleLogin: (newState : boolean) => set((state) => ({ isLoggedIn: newState })),
}))