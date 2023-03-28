import ModalOverlay from "../ModalLayout/ModalOverlay";
import { Text, YStack, XStack, Input } from "tamagui";
import { TextInput } from "react-native";
import * as styles from "./TimePicker.styles";

type TimePickerProp = {
  isOpen: boolean;
  closeModal: () => void;
  onSave: () => void;
  onCancel: () => void;
};

const TimePicker = ({
  isOpen,
  closeModal,
  onSave,
  onCancel,
}: TimePickerProp) => {
  return (
    <ModalOverlay
      isOpen={isOpen}
      closeModal={closeModal}
      title={"Time Duration"}
      onSave={onSave}
      onCancel={onCancel}
      saveTitle={"Save"}
      cancelTitle={"Cancel"}
    >
      <YStack paddingTop={20}>
        <XStack alignItems="center" space={20}>
          <Text fontFamily="InterSemi" w={50}>
            From:
          </Text>
          <XStack alignItems="center" space={10}>
            <YStack alignItems="center">
              <TextInput
                {...styles.textInput}
                multiline={false}
                keyboardType="number-pad"
                textAlign="center"
              />
              <Text {...styles.labelTime}>Hour</Text>
            </YStack>
            <Text mt={5} fontSize={20}>
              :
            </Text>
            <YStack alignItems="center">
              <TextInput
                {...styles.textInput}
                multiline={false}
                keyboardType="number-pad"
                textAlign="center"
              />
              <Text {...styles.labelTime}>Minute</Text>
            </YStack>
          </XStack>
        </XStack>
        <XStack alignItems="center" space={20}>
          <Text fontFamily="InterSemi" w={50}>
            End:
          </Text>
          <XStack alignItems="center" space={10}>
            <YStack alignItems="center">
              <TextInput
                {...styles.textInput}
                multiline={false}
                keyboardType="number-pad"
                textAlign="center"
              />
              <Text {...styles.labelTime}>Hour</Text>
            </YStack>
            <Text mt={5} fontSize={20}>
              :
            </Text>
            <YStack alignItems="center">
              <TextInput
                {...styles.textInput}
                multiline={false}
                keyboardType="number-pad"
                textAlign="center"
              />
              <Text {...styles.labelTime}>Minute</Text>
            </YStack>
          </XStack>
        </XStack>
      </YStack>
    </ModalOverlay>
  );
};

export default TimePicker;
