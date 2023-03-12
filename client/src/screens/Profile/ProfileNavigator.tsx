import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Profile from "./Profile";

export type ProfileStackParams = {
  Profile: undefined;
};

const ProfileStack = createNativeStackNavigator<ProfileStackParams>();

export const ProfileScreenStack = () => {
  return (
    <ProfileStack.Navigator initialRouteName="Profile">
      <ProfileStack.Screen name="Profile" component={Profile} />
    </ProfileStack.Navigator>
  );
};

export default ProfileScreenStack;