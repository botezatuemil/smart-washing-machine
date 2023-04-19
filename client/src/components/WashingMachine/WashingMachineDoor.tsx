import { Stack, Text, YStack } from "tamagui";
import DoorInterior from "../icons/DoorInterior";
import * as styles from "./WashingMachineDoor.styles";

type DoorType = {
  time: string;
  label: string;
};

const WashingMachineDoor = ({ time, label }: DoorType) => {
  return (
    <Stack {...styles.container}>
      <Stack {...styles.doorFrame} position="relative">
        <DoorInterior />
        <YStack position="absolute" alignItems="center">
          <Text color="#989898" fontFamily="Inter">
            {label}
          </Text>
          <Text color="white" fontFamily="InterSemi" fontSize={25}>
            {time}
          </Text>
        </YStack>
      </Stack>
    </Stack>
  );
};

export default WashingMachineDoor;
