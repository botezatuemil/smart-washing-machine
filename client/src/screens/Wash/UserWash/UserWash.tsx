import React from "react";
import { YStack, Text, Stack } from "tamagui";
import { useIncomingReservation } from "../../../api/reservation/incomingReservation/useIncomingReservation";
import { useLoginStore } from "../../../store/LoginStore";

const UserWash = () => {
  const { token } = useLoginStore();
  const { data } = useIncomingReservation(token);
  return (
    <YStack w="100%" h="100%" alignItems="center">
      <Text fontFamily="InterSemi" color="#626262" fontSize={16} mt={27}>
        M4 Washing Machine
      </Text>
      <Text fontFamily="InterSemi" color="#626262" fontSize={16}>
        Laundry 01/ floor 03
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
          Idle
        </Text>
      </Stack>
    </YStack>
  );
};

export default UserWash;
