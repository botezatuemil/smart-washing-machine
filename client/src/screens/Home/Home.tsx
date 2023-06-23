import { useEffect, useRef } from "react";
import { YStack } from "tamagui";
import WashCard from "../../components/WashCard";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigation/TabNavigator";
import * as Notifications from "expo-notifications";
import useAuthToken from "../../hooks/useAuthToken";
import { useQueryClient } from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Home = () => {
  const queryClient = useQueryClient();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  const { id, expoToken, getAuthToken } = useAuthToken();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const refetchNotifications = async () => {
    await queryClient.invalidateQueries("getNotifications");
  };


  useEffect(() => {
    getAuthToken();
  }, []);

  useEffect(() => {
    const processNotification = async () => {
      const lastProcessedNotificationId = await AsyncStorage.getItem(
        "lastProcessedNotificationId"
      );
      refetchNotifications();
      if (
        lastNotificationResponse &&
        lastNotificationResponse.actionIdentifier ===
          Notifications.DEFAULT_ACTION_IDENTIFIER &&
        lastNotificationResponse.notification.request.identifier !==
          lastProcessedNotificationId
      ) {
        
        switch (
          lastNotificationResponse.notification.request.content.data["type"]
        ) {
          case "SCHEDULE_EARLY":
            break;
          case "AVAILABLE":
            navigation.navigate("HomeStack")
            break;
          case "MACHINE_FINISHED":
            navigation.navigate("WashStack", {});

            break;
          default:
            break;
        }
        await AsyncStorage.setItem(
          "lastProcessedNotificationId",
          lastNotificationResponse.notification.request.identifier
        );
      }
    };

    processNotification();
  }, [lastNotificationResponse]);


  return (
    <YStack
      alignItems="center"
      bg="white"
      h="100%"
      paddingTop={20}
      justifyContent="center"
      paddingHorizontal={24}
    >
      <WashCard
        type="washing machine"
        title="Washing Machine"
        imagePath={require("../../assets/images/washingMachineCartoon.png")}
      />
      <WashCard
        type="tumble dryer"
        title="Tumble Dryer"
        imagePath={require("../../assets/images/dryerCartoon.png")}
      />
    </YStack>
  );
};

export default Home;
