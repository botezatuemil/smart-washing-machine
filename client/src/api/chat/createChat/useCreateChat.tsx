import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { createChat } from "./endpoints";

export type ChatRequest = {
  token: string;
  receiverId: number;
};

export const useCreateChat = (
  onSuccess?: (data: string) => void,
  onError?: (error: unknown) => void
) => {
  const queryClient = useQueryClient();
  return useMutation(
    "createChat",
    async (input: ChatRequest) => await createChat(input),
    {
      onSuccess: async (data) => {

        await queryClient.invalidateQueries("getConversations");
      },
      onError: () => console.log("Failed authorizing"),
    }
  );
};
