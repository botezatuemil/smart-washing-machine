import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useEffect, useState } from "react";
import SplashScreen from "../components/Loading/SplashScreen";

import Auth from "../screens/Auth/Auth";
import Explore from "../screens/Home/Home";
import Profile from "../screens/Profile/Profile";
import TabNavigator from "./TabNavigator";

const DrawerStack = createDrawerNavigator<DrawerStackParams>();

export type DrawerStackParams = {
  Tabs: undefined;
  Explore: undefined;
  Profile: undefined;
  Auth: undefined;
};



const DrawerNavigation = () => {
  // const value = await AsyncStorage.getItem('token');

  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const retrieveToken = async () => {
    const value = await AsyncStorage.getItem("token");
    setIsLoading(false);
    setLoggedIn(value === null ? false : true)
  };

  
  useEffect(() => {
    retrieveToken();
  }, []);
  
  if (isLoading) {
    return (
      <SplashScreen/>
    )
  }

 
  return (
    <DrawerStack.Navigator
      initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
      {!isLoggedIn ? (
        <DrawerStack.Screen
          name="Auth"
          component={Auth}
          options={{
            drawerItemStyle: { height: 0 },
          }}
        />
      ) : (
        <>
        <DrawerStack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{
          drawerItemStyle: { height: 0 },
        }}
      />
      <DrawerStack.Screen
        name="Explore"
        component={Explore}
        options={{
          drawerLabel: "Explore",
        }}
      />
      <DrawerStack.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerLabel: "Profile",
        }}
      />
        </>
      )}
      
    </DrawerStack.Navigator>
  );
};

export default DrawerNavigation;
