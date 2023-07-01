import { useQuery } from "react-query";
import { useChatStore } from "../../../store/ChatStore";
import { getConversations } from "./endpoints";

export type Conversations = {
  dormFloor: number;
  dormNumber: string;
  firstName: string;
  id: number;
  lastName: string;
  user1Id: number;
};

export const useConversations = (token: string) => {
  const { setChats } = useChatStore();

  return useQuery<Conversations[]>(
    "getConversations",
    async () => await getConversations(token),
    {
      onSuccess: (data) => {
        setChats(data);
      },
      onError: () => {},
    }
  );
};
