import moment from "moment-timezone";
import React, { useState, useEffect } from "react";
import { YStack, Text, Stack, Button } from "tamagui";
import { useIncomingReservation } from "../../../api/reservation/incomingReservation/useIncomingReservation";
import WashingMachineDoor from "../../../components/WashingMachine/WashingMachineDoor";
import { useLoginStore } from "../../../store/LoginStore";
import { ReservationStore } from "../../../store/ReservationStore";
import * as styles from "./UserWash.styles";
import NfcManager, {NfcTech} from 'react-native-nfc-manager';

type WashingState = "IDLE" | "IN PROGRESS" | "FINISHED" | "SCAN";
NfcManager.start();

const UserWash = () => {
  const { token } = useLoginStore();
  const { data } = useIncomingReservation(token);
  const [deviceState, setDeviceState] = useState<WashingState>("IDLE");
  const [time, setTime] = useState<string>("");
  const [canScan, setCanScan] = useState<boolean>(true);

  const getTime = (deadline: moment.Moment | undefined) => {
    if (data) {
      const end = moment(deadline);
      const now = moment();
      const difference = -moment().toDate().getTimezoneOffset() / 60;
      now.set({ h: now.hour() + difference });

      const remainingTime = moment(end.diff(moment.utc(now)), true).utc();
      setTime(remainingTime.format("HH:mm"));
      console.log(remainingTime.valueOf());

      if (remainingTime.valueOf() <= 0) {
        setDeviceState("SCAN");
      } else {
        setDeviceState("IDLE");
      }
    }
  };

  const scanNFC = async() => {
    setCanScan(true)
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.warn('Tag found', tag);
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  };

  useEffect(() => {
    getTime(data?.startHour);
    const interval = setInterval(() => getTime(data?.startHour), 60000);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <YStack w="100%" h="100%" alignItems="center">
      {data && Object.keys(data).length !== 0 ? (
        <>
          <Text {...styles.headerText} mt={27}>
            {data?.deviceName + " " + data?.type}
          </Text>
          <Text {...styles.headerText} fontSize={16}>
            {data?.laundryName + " / floor " + data?.laundryFloor}
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
        {canScan ? (
          <Button
            onPress={scanNFC}
            // disabled={deviceState === "IDLE" && true}
            backgroundColor={`${
              deviceState === "SCAN" ? "#0055EE" : "#89aae8"
            }`}
          >
            <Text fontFamily="InterSemi" color="white">
              SCAN
            </Text>
          </Button>
        ) : (
          <Text>SCAN NFC</Text>
        )}
      </YStack>
    </YStack>
  );
};
//#0055EE
//#89aae8
export default UserWash;
