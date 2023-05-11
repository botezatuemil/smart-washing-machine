import React from "react";
import { Button, Text } from "tamagui";

type ButtonStateType = {
  onPress: () => void;
  deviceState: "IDLE" | "IN PROGRESS" | "SCAN" | "FINISHED" | "CANCELED";
};
const ButtonState = ({ onPress, deviceState }: ButtonStateType) => {
  const getText = () => {
    if (deviceState === "IDLE" || deviceState === "SCAN") {
      return "SCAN";
    }
    if (deviceState === "IN PROGRESS" || deviceState === "FINISHED") {
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
    <Button
      onPress={onHandlePress}
      disabled={deviceState === "IDLE" || deviceState === "IN PROGRESS"}
      backgroundColor={`${
        deviceState === "SCAN" || deviceState === "FINISHED"
          ? "#0055EE"
          : "#89aae8"
      }`}
    >
      <Text fontFamily="InterSemi" color="white">
        {getText()}
      </Text>
    </Button>
  );
};

export default ButtonState;
