import moment from "moment-timezone";
import React, { useState, useEffect} from "react";
import { YStack, Text, Stack, Button, XStack } from "tamagui";
import { useIncomingReservation } from "../../../api/reservation/incomingReservation/useIncomingReservation";
import WashingMachineDoor from "../../../components/WashingMachine/WashingMachineDoor";
import { useLoginStore } from "../../../store/LoginStore";
import * as styles from "./UserWash.styles";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useQR } from "../../../api/authQR/useQR";
import ButtonState from "../../../components/common/ButtonState";
import { useIsFocused } from "@react-navigation/native";
import { useUserStore } from "../../../store/UserStore";
import { useQueryClient } from "react-query";
import { WashingOption } from "../../../interfaces";


type WashingState =
  | "IDLE"
  | "IN PROGRESS"
  | "FINISHED"
  | "SCAN"
  | "CANCELED"
  | "CONTINUE?"
  | "CONTINUE?";
const opacity = "rgba(0, 0, 0, .6)";

const UserWash = () => {
  const { token } = useLoginStore();
  const { id: user_id, expoToken } = useUserStore();
  const { data: reservation, refetch } = useIncomingReservation(token);

  const [deviceState, setDeviceState] = useState<WashingState>("IDLE");
  const [time, setTime] = useState<string>("");
  const [openCamera, setOpenCamera] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const queryClient = useQueryClient();

  const calculateCurrentTime = () => {
    const now = moment();
    const difference = -moment().toDate().getTimezoneOffset() / 60;
    now.set({ h: now.hour() + difference });
    return now;
  };
  const onSuccess = async(data: string) => {
    refetch();
    await queryClient.refetchQueries(["allDevices", "washing machine" as WashingOption]);
    await queryClient.refetchQueries(["allDevices", "tumble dryer" as WashingOption]);
  };

  const sendQR = useQR(onSuccess);

  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, "0")}:${Math.round(minutes)
      .toString()
      .padStart(2, "0")}`;
  };

  const getTime = () => {
    if (reservation) {
      const now = calculateCurrentTime();
    
      let duration = 0;
      const timePassedSinceReservation = moment
        .duration(moment(reservation.startHour).add("minutes", 10).diff(now))
        .asMinutes();

      // only a window of 10 minutes to scan after that it cancels the reservation
      if (
        moment(reservation.startHour) < now &&
        timePassedSinceReservation >= 0 &&
        reservation.status &&
        reservation.opened
      ) {
        setDeviceState("SCAN");
        duration = timePassedSinceReservation;

        // it passed those 10 minutes and the washing machine is free (there is no one that left clothes or WM is not done)
      } else if (
        moment(reservation.startHour) < now &&
        !reservation.status &&
        reservation.studentId === user_id
      ) {
        setDeviceState("IN PROGRESS");
        duration = moment
          .duration(moment(reservation.endHour).diff(now))
          .asMinutes();

        // the wm machine is done, you did not take the clothes (meaning you did not finish), the end reservation hour did not passed and is your reservation
        // you can continue to wash (you have more time left)
      } else if (
        reservation.status &&
        !reservation.opened &&
        moment(reservation.endHour) > now &&
        moment(reservation.startHour) < now &&
        reservation.studentId === user_id
      ) {
        setDeviceState("CONTINUE?");
        duration = moment
          .duration(moment(reservation.endHour).diff(now))
          .asMinutes();

        // you take your clothes (you quit your reservation earlier than the end hour)
      } else if (moment(reservation.endHour) < now && reservation.status) {
        setDeviceState("FINISHED");
        duration = moment.duration(now.diff(now)).asMinutes();

        // for idle when the reservation did not begin yet
      } else {
        duration = moment
        .duration(moment(reservation.startHour).diff(now))
        .asMinutes();
      }

      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      const displayedTime = formatTime(hours, minutes);
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
    getTime();
    const interval = setInterval(() => getTime(), 1000);
    getBarCodeScannerPermissions();

    return () => clearInterval(interval);
  }, [reservation]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  const handleBarCodeScanned = ({ type, data }: any) => {
    if (data && reservation) {
      if (!scanned) {
        sendQR.mutate({
          token: data,
          reservationId: reservation.id,
          expoPushToken: expoToken,
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
                <ButtonState
                  reservationId={reservation.id}
                  refetch={refetch}
                  token={token}
                  onPress={scanQR}
                  deviceState={deviceState}
                />
              </YStack>
            </>
          ) : (
            <YStack w="100%" h="100%" ai="center" jc="center">
              <Text {...styles.headerText}>
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
