import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Inbox from "./Inbox";

export type InboxStackParams = {
  Inbox: undefined;
};

const InboxStack = createNativeStackNavigator<InboxStackParams>();

export const InboxScreenStack = () => {
  return (
    <InboxStack.Navigator initialRouteName="Inbox">
      <InboxStack.Screen name="Inbox" component={Inbox} />
    </InboxStack.Navigator>
  );
};

export default InboxScreenStack;
