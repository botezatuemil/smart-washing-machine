import { createDrawerNavigator } from "@react-navigation/drawer";
import Explore from "../screens/Explore";
import Profile from "../screens/Profile";
import TabNavigator from "./TabNavigator";

const DrawerStack = createDrawerNavigator<DrawerStackParams>();

export type DrawerStackParams = {
  Tabs: any;
  Explore: any;
  Profile: any;
};
const DrawerNavigation = () => {
  return (
    <DrawerStack.Navigator
      initialRouteName="Tabs"
      screenOptions={{ headerShown: false }}
    >
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
