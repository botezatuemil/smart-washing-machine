import React, { useState } from "react";
import {
  Label,
  Separator,
  Switch,
  XStack,
  Text,
  YStack,
  SizeTokens,
} from "tamagui";

type SwitchType = {
  isActive: boolean;
  setIsActive: (value : boolean) => void;
}

const SwitchWithLabel = ({isActive, setIsActive} : SwitchType) => {
  

  return (
    <XStack w={200} ai="center" space="$4" alignItems="center" pt={10}>
      <Text  miw={90} jc="flex-end" fontFamily="InterMedium">
        Schedule early
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
