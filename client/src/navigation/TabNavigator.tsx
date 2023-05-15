import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import IconFeather from "react-native-vector-icons/Feather";
import IoniIcon from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home as HomeIcon } from "@tamagui/lucide-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import WashScreenStack from "../screens/Wash/WashNavigator";
import HomeScreenStack from "../screens/Home/HomeNavigator";
import ProfileScreenStack from "../screens/Profile/ProfileNavigator";
import ChatScreenStack from "../screens/Chat/ChatNavigator";
import InboxScreenStack from "../screens/Inbox/InboxNavigator";

export const RootStack = createBottomTabNavigator<RootStackParams>();

export type RootStackParams = {
  HomeStack: undefined;
  WashStack: undefined;
  InboxStack: undefined;
  ChatStack: undefined;
  ProfileStack: undefined;
};

export type HomeStackParams = {
  Home: undefined;
};

export default function TabNavigator() {
  const getTabBarVisibility = (route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideOnScreens = ["Laundry"];
    return hideOnScreens.indexOf(routeName as string) <= -1;
  };

  return (
    <RootStack.Navigator
      initialRouteName="HomeStack"
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 100,
          borderTopWidth: 0,
          display: getTabBarVisibility(route) ? "flex" : "none",
        },
      })}
    >
      <RootStack.Screen
        name="WashStack"
        component={WashScreenStack}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <IconMaterial
              name="washing-machine"
              size={25}
              color={`${focused ? "#24B2EF" : "#B6C3CE"}`}
            />
          ),
        }}
      />
      <RootStack.Screen
        name="ChatStack"
        component={ChatScreenStack}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <IoniIcon
              name="chatbubble-ellipses-outline"
              size={25}
              color={`${focused ? "#24B2EF" : "#B6C3CE"}`}
            />
          ),
        }}
      />
      <RootStack.Screen
        name="HomeStack"
        component={HomeScreenStack}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <IconFeather
              name="home"
              size={25}
              color={`${focused ? "#24B2EF" : "#B6C3CE"}`}
            />
          ),
        }}
      />
      <RootStack.Screen
        name="ProfileStack"
        component={InboxScreenStack}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <IconFeather
              name="mail"
              size={25}
              color={`${focused ? "#24B2EF" : "#B6C3CE"}`}
            />
          ),
        }}
      />
      <RootStack.Screen
        name="InboxStack"
        component={ProfileScreenStack}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <IoniIcon
              name="md-person-outline"
              size={25}
              color={`${focused ? "#24B2EF" : "#B6C3CE"}`}
            />
          ),
        }}
      />
    </RootStack.Navigator>
  );
}
