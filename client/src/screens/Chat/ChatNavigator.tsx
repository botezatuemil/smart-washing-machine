import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Chat from "./Chat";

export type ChatStackParams = {
  Chat: undefined;
};

const ChatStack = createNativeStackNavigator<ChatStackParams>();

export const ChatScreenStack = () => {
  return (
    <ChatStack.Navigator initialRouteName="Chat">
      <ChatStack.Screen name="Chat" component={Chat} />
    </ChatStack.Navigator>
  );
};

export default ChatScreenStack;