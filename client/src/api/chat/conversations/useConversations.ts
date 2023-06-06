import { cos } from "react-native-reanimated";
import { useQuery } from "react-query";
import { useChatStore } from "../../../store/ChatStore";
import { useQueryClient } from 'react-query';

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
  const {setChats} = useChatStore();

  return useQuery<Conversations[]>(
    "getConversations",
    async () => await getConversations(token),
    {
      // refetchInterval: 1000,
      onSuccess: (data) => {
        console.log("convos", data)
        setChats(data);
      },
      onError: () => {},
    }
  );
};
