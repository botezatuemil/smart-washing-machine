import React from "react";
import { Button, Text, YStack } from "tamagui";

type ButtonStateType = {
  onPress: () => void;
  deviceState:
    | "IDLE"
    | "IN PROGRESS"
    | "SCAN"
    | "FINISHED"
    | "CANCELED"
    | "CONTINUE?";
};
const ButtonState = ({ onPress, deviceState }: ButtonStateType) => {
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

  const onHandlePress = () => {
    if (deviceState === "FINISHED") {
      // delete reservation, also send open = true to washing device
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
