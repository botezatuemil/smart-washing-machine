import React from "react";
import { Button, Text, XStack, YStack } from "tamagui";
import { useReservationStore } from "../../../store/ReservationStore";
import moment from "moment";
import * as styles from "./History.styles";
import FeatherIcons from "react-native-vector-icons/Feather";
import { TouchableOpacity } from "react-native-gesture-handler";

const History = () => {
  const { reservations, removeReservationStore } = useReservationStore();

  const deleteReservation = (id: React.Key) => {
    removeReservationStore(id);
  };

  

  return (
    <YStack w="100%" px={25} py={80}>
      {reservations &&
        reservations.map((reservation) => (
          <XStack
            ai="center"
            jc="space-between"
            key={reservation.id}
            bg="#F8F8F8"
            p={21}
            borderRadius={12}
          >
            <YStack>
              <Text fontFamily="InterSemi" fontSize={16}>
                {reservation.type === "WASHING_MACHINE"
                  ? "Washing Machine"
                  : "Tumble Dryer"}
              </Text>
              <Text {...styles.subtitle}>
                {reservation.deviceName +
                  " / " +
                  reservation.laundryName +
                  " / floor " +
                  reservation.laundryFloor.toString()}
              </Text>
              <Text {...styles.subtitle}>
                {moment(reservation.startHour).utcOffset(0).format("HH:mm") +
                  " - " +
                  moment(reservation.endHour).utcOffset(0).format("HH:mm")}
              </Text>
            </YStack>
            <TouchableOpacity onPress={() => deleteReservation(reservation.id)}>
              <FeatherIcons name="trash-2" size={32} />
            </TouchableOpacity>
          </XStack>
        ))}
    </YStack>
  );
};

export default History;
