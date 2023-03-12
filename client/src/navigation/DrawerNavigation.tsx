import { createDrawerNavigator } from "@react-navigation/drawer";
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
  return (
    <DrawerStack.Navigator
      initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
       <DrawerStack.Screen
        name="Auth"
        component={Auth}
        options={{
          drawerItemStyle: { height: 0 },
        }}
      />
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
    </DrawerStack.Navigator>
  );
};

export default DrawerNavigation;
