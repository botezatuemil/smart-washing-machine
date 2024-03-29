import { create } from "zustand";
import { Conversations } from "../api/chat/conversations/useConversations";
import { Message } from "../api/chat/messages/messages.const";

export type Chat = {
  conversation: Conversations;
  messages: Message[];
};

type ChatStoreType = {
  chats: Chat[];
  setChats: (conversations: Conversations[]) => void;
  setMessages: (messages: Message[], currentConversationId: number) => void;
  addMessage: (message: Message) => void;
};

export const useChatStore = create<ChatStoreType>()((set, get) => ({
  chats: [],
  setChats: (conversations: Conversations[]) => {
    const chats = conversations.map((conversation) => {
      return {
        conversation,
        messages: [],
      };
    });
    set({ chats: chats });
  },
  setMessages: (messages: Message[], currentConversationId: number) => {
    const existingChats = get().chats;
    const updatedChats = existingChats.map(chat => chat.conversation.id === currentConversationId ? {...chat, messages: messages} : {...chat});
    set({ chats: updatedChats });
  },
  addMessage : (message: Message) => {
    const existingChats = get().chats;
    const updatedChats = existingChats.map(chat => {
      if (chat.conversation.id === message.conversationId) {
        return  {...chat, messages: [...chat.messages, message]}
      } else {
        return {...chat}
      }
    } );
    set({ chats: updatedChats });
  }
}));
