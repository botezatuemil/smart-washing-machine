import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { useChatStore } from "../../../store/ChatStore";
import { getMessages } from "./endpoints";
import { Message, RequestMessage } from "./messages.const";

export const useMessages = (input: RequestMessage) => {
  const {setMessages} = useChatStore();
  return useQuery<Message[]>("getMessages", async () => await getMessages(input), {
    // refetchInterval: 1000,
    onSuccess: (data) => {
      setMessages(data, input.conversationId)
    },
    onError: () => {},
  });
};
