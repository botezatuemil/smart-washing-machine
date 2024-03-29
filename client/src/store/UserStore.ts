import React from "react";
import { create } from "zustand";

type UserType = {
  id: React.Key;
  firstName: string;
  lastName: string;
  expoToken: string | undefined;
  setId: (newState: React.Key) => void;
  setFirstName: (newState: string) => void;
  setLastName: (newState: string) => void;
  setExpoToken : (newState: string | undefined) => void;
};

export const useUserStore = create<UserType>()((set) => ({
  id: 0,
  firstName: "",
  lastName: "",
  expoToken: "",
  setId: (newState: React.Key) => set((state) => ({ id: newState })),
  setFirstName: (newState: string) => set((state) => ({ firstName: newState })),
  setLastName: (newState: string) => set((state) => ({ lastName: newState })),
  setExpoToken : (newState: string | undefined) => set((state) => ({expoToken: newState}))
}));
