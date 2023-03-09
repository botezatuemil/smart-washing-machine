import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { TamaguiProvider, Theme, YStack } from "tamagui";
import { NavigationContainer } from "@react-navigation/native";
import config from "./tamagui.config";
import { useFonts } from "expo-font";
import "react-native-gesture-handler";
import DrawerNavigation from "./src/navigation/DrawerNavigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";

const RootStack = createNativeStackNavigator<RootStackParams>();

export type RootStackParams = {
  Drawer: any;
};

export default function App() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={colorScheme === "dark" ? "dark" : "light"}>
        <NavigationContainer>
          <RootStack.Navigator
            initialRouteName="Drawer"
            screenOptions={{ headerShown: false }}
          >
            <RootStack.Screen name="Drawer" component={DrawerNavigation} />
          </RootStack.Navigator>
        </NavigationContainer>
      </Theme>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
});
