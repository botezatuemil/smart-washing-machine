import ModalOverlay from "../ModalLayout/ModalOverlay";
import { Text, YStack, XStack, Input } from "tamagui";
import { NativeSyntheticEvent, TextInput, TextInputChangeEventData } from "react-native";
import * as styles from "./TimePicker.styles";
import { useState } from "react";

type TimePickerProp = {
  isOpen: boolean;
  closeModal: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (timestamp :string ) => void;
};

const TimePicker = ({
  isOpen,
  closeModal,
  onSave,
  onCancel,
  onChange
}: TimePickerProp) => {

  const [firstHour, setFirstHour] = useState<string>("");
  const [firstMinute, setFirstMinute]= useState<string>("");
  const [lastHour, setLastHour] = useState<string>("");
  const [lastMinute, setLastMinute] = useState<string>("");


  const onSaveInput = () => {
    const start = firstHour + ":" + firstMinute;
    const end = lastHour + ":" + lastMinute;
    const timestamp = start + " - " + end;
    onChange(timestamp);
    onSave();
  }
  
  return (
    <ModalOverlay
      isOpen={isOpen}
      closeModal={closeModal}
      title={"Time Duration"}
      onSave={onSaveInput}
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
                onChange={(e : NativeSyntheticEvent<TextInputChangeEventData>) => setFirstHour(e.nativeEvent.text)}
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
                onChange={(e : NativeSyntheticEvent<TextInputChangeEventData>) => setFirstMinute(e.nativeEvent.text)}
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
                onChange={(e : NativeSyntheticEvent<TextInputChangeEventData>) => setLastHour(e.nativeEvent.text)}
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
                onChange={(e : NativeSyntheticEvent<TextInputChangeEventData>) => setLastMinute(e.nativeEvent.text)}
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
