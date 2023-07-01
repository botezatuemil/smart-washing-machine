import React from "react";
import { Switch, XStack, Text, TextProps } from "tamagui";

type SwitchType = {
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  label: string;
  textProps?: TextProps;
};

const SwitchWithLabel = ({
  isActive,
  setIsActive,
  label,
  textProps,
}: SwitchType) => {
  return (
    <XStack w={200} ai="center" space="$4" alignItems="center" pt={10}>
      <Text miw={90} jc="flex-end" fontFamily="InterMedium" {...textProps}>
        {label}
      </Text>
      <Switch
        size="$3"
        borderRadius={150}
        alignItems="center"
        backgroundColor={`${isActive ? "#3379fa" : "#f3f3f3"}`}
        borderWidth={1}
        borderColor={`${isActive ? "white" : "#e0dede"}`}
        onCheckedChange={() => setIsActive(!isActive)}
        checked={isActive}
      >
        <Switch.Thumb bg="black" animation="bouncy" />
      </Switch>
    </XStack>
  );
};

export default SwitchWithLabel;
