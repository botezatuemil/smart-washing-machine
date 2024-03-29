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
import { useDeleteReservation } from "../../../api/reservation/delete/useDeleteReservation";
import { useLoginStore } from "../../../store/LoginStore";

const History = () => {
  const { reservations, removeReservationStore, sortedReservations } =
    useReservationStore();
  const { id } = useUserStore();
  const { token } = useLoginStore();
  const deleteReservation = useDeleteReservation();

  const onDeleteReservation = (id: React.Key) => {
    deleteReservation.mutate({ reservationId: id, token });
  };

  const { data } = useHistory(id);
  const hashmap = sortedReservations();

  return (
    <>
      {hashmap.size !== 0 ? (
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
                <Text fontFamily="InterBold" fontSize={16}>
                  {key}
                </Text>
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
                          moment(reservation.endHour)
                            .utcOffset(0)
                            .format("HH:mm")}
                      </Text>
                    </YStack>
                    <TouchableOpacity
                      onPress={() => onDeleteReservation(reservation.id)}
                    >
                      <FeatherIcons name="trash-2" size={32} />
                    </TouchableOpacity>
                  </XStack>
                ))}
              </YStack>
            ))}
          </YStack>
        </ScrollView>
      ) : (
        <YStack w="100%" h="100%" ai="center" jc="center">
          <Text fontFamily="InterSemi" color="#626262" fontSize={16} mt={27}>
            No reservations in history
          </Text>
          <Text>Please make a reservation first</Text>
        </YStack>
      )}
    </>
  );
};

export default History;
