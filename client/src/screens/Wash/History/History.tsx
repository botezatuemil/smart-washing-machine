import React, { useEffect, useState } from "react";
import { Button, ScrollView, Text, XStack, YStack } from "tamagui";
import {
  ReservationStore,
  useReservationStore,
} from "../../../store/ReservationStore";
import moment from "moment";
import * as styles from "./History.styles";
import FeatherIcons from "react-native-vector-icons/Feather";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useHistory } from "../../../api/reservation/getHistory/useHistory";
import { useUserStore } from "../../../store/UserStore";

const History = () => {
  const { reservations, removeReservationStore, sortedReservations } =
    useReservationStore();
  const { id } = useUserStore();

  const deleteReservation = (id: React.Key) => {
    removeReservationStore(id);
  };

  const { data } = useHistory(id);
  const hashmap = sortedReservations();

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      w="100%"
      h="100%"
      px={25}
      py={40}
      space={20}
    >
      <YStack w="100%" h="100%" space={50}>
        {Array.from(hashmap.entries()).map(([key, values]) => (
          <YStack space={10}>
            <Text fontFamily="InterBold" fontSize={16}>{key}</Text>
            {values?.map((reservation) => (
              <XStack
                ai="center"
                jc="space-between"
                key={reservation.id}
                bg="#F8F8F8"
                p={21}
                borderRadius={8}
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
                    {moment(reservation.startHour)
                      .utcOffset(0)
                      .format("HH:mm") +
                      " - " +
                      moment(reservation.endHour).utcOffset(0).format("HH:mm")}
                  </Text>
                </YStack>
                <TouchableOpacity
                  onPress={() => deleteReservation(reservation.id)}
                >
                  <FeatherIcons name="trash-2" size={32} />
                </TouchableOpacity>
              </XStack>
            ))}
          </YStack>
        ))}
      </YStack>
    </ScrollView>
  );
};

export default History;
