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
        // lastNotificationResponse.notification.request.content.data['someDataToCheck'] &&
        lastNotificationResponse.actionIdentifier ===
          Notifications.DEFAULT_ACTION_IDENTIFIER &&
        lastNotificationResponse.notification.request.identifier !==
          lastProcessedNotificationId
      ) {
        // Execute your logic here
        
        switch (
          lastNotificationResponse.notification.request.content.data["type"]
        ) {
          case "SCHEDULE_EARLY":
            console.log("schedule")
            break;
          case "AVAILABLE":
            navigation.navigate("HomeStack")
            break;
          case "MACHINE_FINISHED":
            console.log("navigate")
            navigation.navigate("WashStack", {});

            break;
          default:
            break;
        }
        // Set the last processed notification ID
        await AsyncStorage.setItem(
          "lastProcessedNotificationId",
          lastNotificationResponse.notification.request.identifier
        );
      }
    };

    processNotification();
  }, [lastNotificationResponse]);

  // useEffect(() => {
  //   // notificationListener.current =
  //   //   Notifications.addNotificationReceivedListener((notification) => {
  //   //     console.log("not", notification);
  //   //     if (notification) {
  //   //     }
  //   //   });

  //   if (
  //     lastNotificationResponse &&
  //     lastNotificationResponse.notification.request.content.data.url &&
  //     lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
  //   ) {
  //     // Linking.openURL(lastNotificationResponse.notification.request.content.data.url);
  //     console.log("a intrat")
  //   }

  //   // responseListener.current =
  //   //   Notifications.addNotificationResponseReceivedListener((response) => {
  //   //     if (response) {
  //   //       const receivedNotification =
  //   //         response.notification.request.content.data;
  //   //       console.log("notif", response.notification.request.content.data);
  //   //       console.log("id notif", id);
  //   //       refetchNotifications();
  //   //       console.log("am primit notificare boss")
  //   //       if (parseInt(receivedNotification.id as string) === id) {
  //   //         // navigation.navigate("WashStack");

  //   //       }
  //   //       // } else {
  //   //       //   navigationOtherUsers.navigate("Laundry", {
  //   //       //     option:
  //   //       //       receivedNotification.type === "WASHING_MACHINE"
  //   //       //         ? "washing machine"
  //   //       //         : "tumble dryer",
  //   //       //   });
  //   //       // }
  //   //     }
  //   //   });

  //   // return () => {
  //   //   Notifications.removeNotificationSubscription(
  //   //     notificationListener.current
  //   //   );
  //   //   Notifications.removeNotificationSubscription(responseListener.current);
  //   // };
  // }, [expoToken, lastNotificationResponse]);

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
