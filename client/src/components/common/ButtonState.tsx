import React from "react";
import { Button, Text, YStack } from "tamagui";
import { useEndReservation } from "../../api/reservation/endReservation/useEndReservation";

type ButtonStateType = {
  onPress: () => void;
  deviceState:
    | "IDLE"
    | "IN PROGRESS"
    | "SCAN"
    | "FINISHED"
    | "CANCELED"
    | "CONTINUE?",
  reservationId: React.Key;
  token: string;
  refetch: () => void;
};
const ButtonState = ({ onPress, deviceState, reservationId, token, refetch }: ButtonStateType) => {

  const endReservation = useEndReservation();

  const getText = () => {
    if (deviceState === "IDLE" || deviceState === "SCAN") {
      return "SCAN";
    }
    if (
      deviceState === "IN PROGRESS" ||
      deviceState === "FINISHED" ||
      deviceState === "CONTINUE?"
    ) {
      return "COMPLETE";
    }
  };

  const onHandlePress = async() => {
    if (deviceState === "FINISHED" || deviceState === "CONTINUE?") {
      endReservation.mutate({reservationId, token})
      return;
    }
    onPress();
  };

  return (
    <YStack space={10}>
      <Button
        onPress={onHandlePress}
        disabled={deviceState === "IDLE" || deviceState === "IN PROGRESS"}
        backgroundColor={`${
          deviceState === "SCAN" || deviceState === "FINISHED" || deviceState === "CONTINUE?"
            ? "#0055EE"
            : "#89aae8"
        }`}
      >
        <Text fontFamily="InterSemi" color="white">
          {getText()}
        </Text>
      </Button>
      {deviceState === "CONTINUE?" && (
        <Button onPress={onPress} backgroundColor="#0055EE">
          <Text fontFamily="InterSemi" color="white">
            NEW
          </Text>
        </Button>
      )}
    </YStack>
  );
};

export default ButtonState;
