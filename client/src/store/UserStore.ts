import React from "react";
import { create } from "zustand";

type UserType = {
  id: React.Key;
  firstName: string;
  lastName: string;
  setId: (newState: React.Key) => void;
  setFirstName: (newState: string) => void;
  setLastName: (newState: string) => void;
};

export const useUserStore = create<UserType>()((set) => ({
  id: 0,
  firstName: "",
  lastName: "",
  setId: (newState: React.Key) => set((state) => ({ id: newState })),
  setFirstName: (newState: string) => set((state) => ({ firstName: newState })),
  setLastName: (newState: string) => set((state) => ({ lastName: newState })),
}));
