import React from "react";
import { Button, Text } from "tamagui";

type ButtonStateType = {
  onPress: () => void;
  deviceState: "IDLE" | "IN PROGRESS" | "SCAN" | "FINISHED" | "CANCELED" | "FREE";
};
const ButtonState = ({ onPress, deviceState }: ButtonStateType) => {
  const getText = () => {
    if (deviceState === "IDLE" || deviceState === "SCAN") {
      return "SCAN";
    }
    if (deviceState === "IN PROGRESS") {
      return "COMPLETE";
    }
  };

  return (
    <Button
      onPress={onPress}
      disabled={
        deviceState === "IDLE" || (deviceState === "IN PROGRESS" && true)
      }
      backgroundColor={`${deviceState === "SCAN" ? "#0055EE" : "#89aae8"}`}
    >
      <Text fontFamily="InterSemi" color="white">
        {getText()}
      </Text>
    </Button>
  );
};

export default ButtonState;
