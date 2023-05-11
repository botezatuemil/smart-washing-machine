import moment from "moment-timezone";
import React, { useState, useEffect, useRef } from "react";
import { YStack, Text, Stack, Button, XStack } from "tamagui";
import { useIncomingReservation } from "../../../api/reservation/incomingReservation/useIncomingReservation";
import WashingMachineDoor from "../../../components/WashingMachine/WashingMachineDoor";
import { useLoginStore } from "../../../store/LoginStore";
import { ReservationStore } from "../../../store/ReservationStore";
import * as styles from "./UserWash.styles";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useQR } from "../../../api/authQR/useQR";
import ButtonState from "../../../components/common/ButtonState";
import { useDeviceStatusStore } from "../../../store/DeviceStatus";
import { PORT, IP, APP_ID } from "@env";
import io from "socket.io-client";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useUserStore } from "../../../store/UserStore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

type WashingState = "IDLE" | "IN PROGRESS" | "FINISHED" | "SCAN" | "CANCELED";
const opacity = "rgba(0, 0, 0, .6)";

const UserWash = () => {
  const { token } = useLoginStore();
  const { id: user_id } = useUserStore();
  const { data: reservation, refetch } = useIncomingReservation(token);
  // const { status, setStatus } = useDeviceStatusStore();

  const [deviceState, setDeviceState] = useState<WashingState>("IDLE");
  const [time, setTime] = useState<string>("");
  const [openCamera, setOpenCamera] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);

  const [startHour, setStartHour] = useState<moment.Moment>();
  const [endHour, setEndHour] = useState<moment.Moment>();
  

  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  // console.log("reservation", reservation);

  const calculateCurrentTime = () => {
    const now = moment();
    const difference = -moment().toDate().getTimezoneOffset() / 60;
    now.set({ h: now.hour() + difference });
    return now;
  };

  const calculateDifference = (end: moment.Moment, now: moment.Moment) => {
    let duration = 0, hours = 0, minutes = 0;
    if (reservation) {
      if (reservation.endHour > now) {
        duration = moment.duration(end.diff(moment.utc(now))).asMinutes();
      } else if (reservation.endHour > calculateCurrentTime()) {
        duration = moment
          .duration(moment.utc(end).add("minutes", 10).diff(moment.utc(now)))
          .asMinutes();
      } else {
        duration = moment.duration(end.diff(moment.utc(end))).asMinutes();
      }
      hours = Math.floor(duration / 60);
      minutes = duration % 60;
    }
    return { duration, hours, minutes };
  };

  const setInitialTime = () => {
    // set these times, only if i currently

    if (reservation)
      if (reservation.washingDeviceStudentId === user_id) {
        // console.log("res", reservation.washingDeviceStudentId);
        if (!reservation.status && reservation.endHour > calculateCurrentTime()) {
          return reservation.endHour;
        } else {
          return calculateCurrentTime()
        }
      }
    return reservation?.startHour;
  };

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    // if (Platform.OS === 'android') {
    //   Notifications.setNotificationChannelAsync('default', {
    //     name: 'default',
    //     importance: Notifications.AndroidImportance.MAX,
    //     vibrationPattern: [0, 250, 250, 250],
    //     lightColor: '#FF231F7C',
    //   });
    // }

    return token;
  }
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    console.log(notification && notification.request.content.title);
    console.log(notification && notification.request.content.body);
    console.log(
      notification && JSON.stringify(notification.request.content.data)
    );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const onSuccess = (data: string) => {
    refetch();
  };

  const sendQR = useQR(onSuccess);

  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, "0")}:${Math.round(minutes)
      .toString()
      .padStart(2, "0")}`;
  };

  const getTime = (deadline: moment.Moment | undefined) => {
    if (reservation) {
      const end = moment(deadline);
      const now = calculateCurrentTime();

      let { duration, hours, minutes } = calculateDifference(end, now);
      let displayedTime = formatTime(hours, minutes);
      displayedTime = formatTime(hours, minutes);
     
      // only a window of 10 minutes to scan after that it cancels the reservation
      // duration <= 0 && duration >= -10
      if (reservation.startHour < now && duration <= 10 && reservation.status && reservation.opened) {
        setDeviceState("SCAN");
        // it passed those 10 minutes and the washing machine is free (there is no one that left clothes or WM is not done)
      } else if (reservation.startHour < now && !reservation.status && reservation.washingDeviceStudentId === user_id) {
        setDeviceState("IN PROGRESS");
       
      } else if (moment(reservation.endHour) < now && reservation.status) {
        setDeviceState("FINISHED");
      } 
      setTime(displayedTime);
    }
  };

  const scanQR = async () => {
    setOpenCamera(true);
    if (!hasPermission) getBarCodeScannerPermissions();
  };

  const getBarCodeScannerPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    const deadline = setInitialTime();
    console.log(deadline);
    getTime(deadline);
    const interval = setInterval(() => getTime(deadline), 1000);
    getBarCodeScannerPermissions();

    return () => clearInterval(interval);
  }, [reservation, deviceState]);

  const handleBarCodeScanned = ({ type, data }: any) => {
    if (data && reservation) {
      if (!scanned) {
        sendQR.mutate({
          token: data,
          reservationId: reservation.id,
          expoPushToken: expoPushToken,
          user_id: user_id,
        });
        setScanned(true);
      }
      setTimeout(() => {
        setOpenCamera(false);
        setScanned(false);
      }, 500);
    }
  };

  return (
    <>
      {!openCamera ? (
        <YStack w="100%" h="100%" alignItems="center">
          {reservation && Object.keys(reservation).length !== 0 ? (
            <>
              <Text {...styles.headerText} mt={27}>
                {reservation?.deviceName + " " + reservation?.type}
              </Text>
              <Text {...styles.headerText} fontSize={16}>
                {reservation?.laundryName +
                  " / floor " +
                  reservation?.laundryFloor}
              </Text>
              <Stack
                bg="#FAFAFA"
                borderColor="#626262"
                borderWidth={2}
                borderRadius={150}
                px={25}
                py={4}
                mt={28}
              >
                <Text fontFamily="InterSemi" color="#626262">
                  {deviceState}
                </Text>
              </Stack>
              <WashingMachineDoor label="Remaining Time" time={time} />
              <YStack h="30%" w="85%" justifyContent="flex-end">
                <ButtonState onPress={scanQR} deviceState={deviceState} />
              </YStack>
            </>
          ) : (
            <YStack w="100%" h="100%" ai="center" jc="center">
              <Text {...styles.headerText} mt={27}>
                No reservation incoming
              </Text>
              <Text {...styles.text}>Please make a reservation first</Text>
            </YStack>
          )}
        </YStack>
      ) : (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={{
            flex: 1,
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          <Stack backgroundColor={opacity} flex={1} />
          <XStack flex={1}>
            <Stack backgroundColor={opacity} flex={1} />
            <Stack flex={5} borderColor="green" borderWidth={1} />
            <Stack backgroundColor={opacity} flex={1} />
          </XStack>
          <Stack backgroundColor={opacity} flex={1} jc="center" ai="center">
            <Button
              onPress={() => setOpenCamera(false)}
              fontFamily="Inter"
              w="30%"
              color="#a8a6a6"
              borderColor="#626262"
              backgroundColor="$backgroundTransparent"
            >
              Cancel
            </Button>
          </Stack>
        </BarCodeScanner>
      )}
    </>
  );
};

export default UserWash;
