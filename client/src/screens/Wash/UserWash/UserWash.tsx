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
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

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
  const { data: reservation, refetch } = useIncomingReservation(token);
  const { status, setStatus } = useDeviceStatusStore();

  const [deviceState, setDeviceState] = useState<WashingState>("IDLE");
  const [time, setTime] = useState<string>("");
  const [openCamera, setOpenCamera] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);

  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [notification, setNotification] = useState< Notifications.Notification>();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
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
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
    console.log(notification && notification.request.content.title)
    console.log(notification && notification.request.content.body)
    console.log(notification && JSON.stringify(notification.request.content.data))

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);



  const onSuccess = (data: string) => {
    refetch();
  };

  const sendQR = useQR(onSuccess);

  const calculateCurrentTime = () => {
    const now = moment();
    const difference = -moment().toDate().getTimezoneOffset() / 60;
    now.set({ h: now.hour() + difference });
    return now;
  };

  const calculateDifference = (end: moment.Moment, now: moment.Moment) => {
    const duration = moment.duration(end.diff(moment.utc(now))).asMinutes();
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return { duration, hours, minutes };
  };

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

      // only a window of 10 minutes to scan after that it cancels the reservation
      // duration <= 0 && duration >= -10
      if (duration >= 0 && status) {
        displayedTime = formatTime(-hours, minutes);
        setDeviceState("SCAN");
      } else if (duration >= 0 && !status) {
        setDeviceState("IN PROGRESS");
      } else if (duration >= 0) {
        setDeviceState("IDLE");
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
    if (deviceState !== "FINISHED") {
      if (reservation) {
        setStatus(reservation.status);
      }
      const deadline = reservation?.status
        ? reservation?.startHour
        : reservation?.endHour;
      getTime(deadline);
      const interval = setInterval(() => getTime(deadline), 60000);
      getBarCodeScannerPermissions();

      return () => clearInterval(interval);
    }
  }, [reservation, status]);


  // const startSocketConnection = () => {
  //   const socket = io(`http://${IP}:${PORT}`);
  //   socket.on("connect", () => {
  //     console.log("connected");
  //   });

  //   socket.on("disconnect", (reason) => {
  //     console.log("disconnected", reason);
  //   });

  //   socket.on("washing_machine", (msg : boolean) => {
  //     console.log("Received message: ", msg);
  //     if (msg) {
  //       setDeviceState("FINISHED");
  //     }
  //   });

  //  return socket
  // }

  const handleBarCodeScanned = ({ type, data }: any) => {
    if (data && reservation) {
      if (!scanned) {
        sendQR.mutate({ token: data, reservationId: reservation.id, expoPushToken: expoPushToken });
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
            </>
          ) : (
            <Text {...styles.headerText} mt={27}>
              No reservation incoming
            </Text>
          )}
          <WashingMachineDoor label="Remaining Time" time={time} />
          <YStack h="30%" w="85%" justifyContent="flex-end">
            <ButtonState onPress={scanQR} deviceState={deviceState} />
          </YStack>
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
