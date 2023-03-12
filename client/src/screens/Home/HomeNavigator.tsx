import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Home from "./Home";

export type HomeStackParams = {
  Home: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParams>();

export const HomeScreenStack = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen name="Home" component={Home} />
    </HomeStack.Navigator>
  );
};

export default HomeScreenStack;
