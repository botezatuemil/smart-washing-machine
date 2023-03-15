import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Home from "./Home";
import { Avatar, Text } from "tamagui";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { TouchableOpacity } from "react-native-gesture-handler";
import { WashingOption } from "../../interfaces";
import Laundry from "../../components/laundry/Laundry";

export type HomeStackParams = {
  Home: undefined;
  Laundry: { option: WashingOption };
};

const HomeStack = createNativeStackNavigator<HomeStackParams>();

export const HomeScreenStack = ({ navigation }: any) => {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: "white",
        },
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <EntypoIcon name="menu" size={30} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity>
            <Avatar circular size={30} marginRight={10}>
              <Avatar.Image
                accessibilityLabel="Cam"
                src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
              />
              <Avatar.Fallback backgroundColor="$blue10" />
            </Avatar>
          </TouchableOpacity>
        ),
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{ title: "LAUNDRY" }}
      />
      <HomeStack.Screen
        name="Laundry"
        component={Laundry}
        options={({ route }) => ({ title: route.params.option.toUpperCase() })}
      />
    </HomeStack.Navigator>
  );
};

export default HomeScreenStack;
