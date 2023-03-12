import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Wash from "../Wash/Wash";

export type WashStackParams = {
  Wash: undefined;
};

const WashStack = createNativeStackNavigator<WashStackParams>();

export const WashScreenStack = () => {
  return (
    <WashStack.Navigator
      initialRouteName="Wash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <WashStack.Screen name="Wash" component={Wash} />
    </WashStack.Navigator>
  );
};

export default WashScreenStack;
