import moment from "moment-timezone";
import React, { useState, useEffect } from "react";
import { YStack, Text, Stack, Button, XStack } from "tamagui";
import { useIncomingReservation } from "../../../api/reservation/incomingReservation/useIncomingReservation";
import WashingMachineDoor from "../../../components/WashingMachine/WashingMachineDoor";
import { useLoginStore } from "../../../store/LoginStore";
import { ReservationStore } from "../../../store/ReservationStore";
import * as styles from "./UserWash.styles";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useQR } from "../../../api/authQR/useQR";

type WashingState = "IDLE" | "IN PROGRESS" | "FINISHED" | "SCAN" | "CANCELED";
const opacity = "rgba(0, 0, 0, .6)";

const UserWash = () => {
  const { token } = useLoginStore();
  const { data: reservation } = useIncomingReservation(token);
  const [deviceState, setDeviceState] = useState<WashingState>("IDLE");
  const [time, setTime] = useState<string>("");
  const [openCamera, setOpenCamera] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);

  const sendQR = useQR();

  const getTime = (deadline: moment.Moment | undefined) => {
    if (reservation) {
      const end = moment(deadline);
      const now = moment();
      const difference = -moment().toDate().getTimezoneOffset() / 60;
      now.set({ h: now.hour() + difference });

      const duration = moment.duration(end.diff(moment.utc(now))).asMinutes();
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      const formattedDiff = `${hours.toString().padStart(2, "0")}:${Math.round(
        minutes
      )
        .toString()
        .padStart(2, "0")}`;
      setTime(formattedDiff);

      // only a window of 10 minutes to scan after that it cancels the reservation
      // duration <= 0 && duration >= -10
      if (duration >= 0) {
        setDeviceState("SCAN");
      } else if (duration > 0) {
        setDeviceState("IDLE");
      } else {
        setDeviceState("CANCELED");
      }
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
    getTime(reservation?.startHour);
    const interval = setInterval(() => getTime(reservation?.startHour), 60000);
    getBarCodeScannerPermissions();

    return () => clearInterval(interval);
  }, [reservation]);

  const handleBarCodeScanned = ({ type, data }: any) => {
    if (data && reservation) {
      if (!scanned) {
        sendQR.mutate({ token: data, reservationId: reservation.id });
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
            <Button
              onPress={scanQR}
              disabled={deviceState === "IDLE" && true}
              backgroundColor={`${
                deviceState === "SCAN" ? "#0055EE" : "#89aae8"
              }`}
            >
              <Text fontFamily="InterSemi" color="white">
                SCAN
              </Text>
            </Button>
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
