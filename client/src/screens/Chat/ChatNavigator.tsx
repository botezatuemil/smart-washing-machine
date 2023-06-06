import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Chat from "./Chat";
import Conversations from "./Conversations";

export type ChatStackParams = {
  Conversations: undefined;
  Chat: { conversationId: number, title: string };
};

const ChatStack = createNativeStackNavigator<ChatStackParams>();

export const ChatScreenStack = () => {
  return (
    <ChatStack.Navigator initialRouteName="Conversations">
      <ChatStack.Screen name="Conversations" component={Conversations} />
      <ChatStack.Screen
        name="Chat"
        component={Chat}
        options={({ route }) => ({ title: route.params.title })}
      />
    </ChatStack.Navigator>
  );
};

export default ChatScreenStack;
