import { useEffect, useRef } from "react";
import { YStack } from "tamagui";
import WashCard from "../../components/WashCard";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigation/TabNavigator";
import * as Notifications from "expo-notifications";
import { HomeStackParams } from "./HomeNavigator";
import useAuthToken from "../../hooks/useAuthToken";
import { useQueryClient } from "react-query";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Home = () => {
  const queryClient = useQueryClient();

  const { id, expoToken, getAuthToken } = useAuthToken();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const navigationOtherUsers =
    useNavigation<NativeStackNavigationProp<HomeStackParams>>();

  const refetchNotifications = async () => {
    await queryClient.invalidateQueries("getNotifications");
  };

  useEffect(() => {
    getAuthToken();
  }, []);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("not", notification);
        if (notification) {
        }
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (response) {
          const receivedNotification =
            response.notification.request.content.data;
          console.log("notif", response.notification.request.content.data);
          console.log("id notif", id);
          refetchNotifications();
          if (parseInt(receivedNotification.id as string) === id) {
            navigation.navigate("WashStack");
          }
          // } else {
          //   navigationOtherUsers.navigate("Laundry", {
          //     option:
          //       receivedNotification.type === "WASHING_MACHINE"
          //         ? "washing machine"
          //         : "tumble dryer",
          //   });
          // }
        }
      });
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [expoToken]);

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
