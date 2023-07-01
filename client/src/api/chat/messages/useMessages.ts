import { useQuery } from "react-query";
import { useChatStore } from "../../../store/ChatStore";
import { getMessages } from "./endpoints";
import { Message, RequestMessage } from "./messages.const";

export const useMessages = (input: RequestMessage) => {
  const {setMessages} = useChatStore();
  return useQuery<Message[]>("getMessages", async () => await getMessages(input), {
    onSuccess: (data) => {
      setMessages(data, input.conversationId)
    },
    onError: () => {},
  });
};
