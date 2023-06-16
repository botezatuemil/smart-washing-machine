import React, { useState } from "react";
import { ScrollView, Text, Stack, XStack, YStack } from "tamagui";
import { Dimensions, View } from "react-native";
import ModalOverlay from "../Modal/ModalLayout/ModalOverlay";
import { LinearGradient } from "expo-linear-gradient";

type TimePick = {
  isOpen: boolean;
  closeModal: () => void;
  selectedInterval: string;
  onChange: (time: string) => void;
};
const ITEM_HEIGHT = 45;

const TimePickerScroll = ({
  isOpen,
  closeModal,
  selectedInterval,
  onChange,
}: TimePick) => {
  const [selectedHour, setSelectedHour] = useState("09");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const startHour = parseInt(selectedInterval?.split(" - ")[0]?.split(":")[0]);
  const startMinute = parseInt(
    selectedInterval?.split(" - ")[0]?.split(":")[1]
  );

  const endHour = parseInt(selectedInterval?.split(" - ")[1]?.split(":")[0]);
  const endMinute = parseInt(selectedInterval?.split(" - ")[1]?.split(":")[1]);

  const generateHourOptions = () => {
    const options: Record<string, number[]>[] = [];
    for (let h = startHour; h <= endHour; h++) {
      let obj: Record<string, number[]> = {};
      let minutes = [];

      if (h === startHour) {
        for (let m = startMinute; m < 60; m++) {
          minutes.push(m);
        }
      } else if (h === endHour) {
        for (let m = 0; m <= endMinute; m++) {
          minutes.push(m);
        }
      } else {
        for (let m = 0; m < 60; m++) {
          minutes.push(m);
        }
      }
      obj[h.toString().padStart(2, "0")] = minutes;
      options.push(obj);
    }
    return options;
  };

  const generateMinuteOptions = () => {
    const options = [];
    for (let m = 0; m < 60; m++) {
      options.push(m.toString().padStart(2, "0"));
    }
    return options;
  };

  const onSaveInput = () => {
    onChange(selectedHour + ":" + selectedMinute);
    closeModal();
  };

  const options = generateHourOptions();

  return (
    <ModalOverlay
      isOpen={isOpen}
      closeModal={closeModal}
      title={"Time Duration"}
      onSave={onSaveInput}
      onCancel={closeModal}
      saveTitle={"Save"}
      cancelTitle={"Cancel"}
    >
      <XStack w="100%" ai="center" justifyContent="center">
        <Stack>
          <ScrollView
            decelerationRate="fast"
            w="auto"
            showsVerticalScrollIndicator={false}
            style={{
              height: ITEM_HEIGHT * 3,
              overflow: "hidden",
            }}
            onScroll={(event) => {
              const offsetY = event.nativeEvent.contentOffset.y;
              const index = Math.round(offsetY / ITEM_HEIGHT);
              setSelectedHour(Object.keys(options[index])[0]);
            }}
            snapToInterval={ITEM_HEIGHT}
          >
            <View style={{ height: ITEM_HEIGHT }} />
            {options.map((hour, index) => (
              <View
                key={index}
                style={{
                  height: ITEM_HEIGHT,
                  justifyContent: "center",
                }}
              >
                <Text fontFamily="Inter" fontSize={30}>
                  {Object.keys(hour)[0]}
                </Text>
              </View>
            ))}
            <View style={{ height: ITEM_HEIGHT }} />
          </ScrollView>
        </Stack>

        <Stack w="10%" ai="center" justifyContent="center">
          <Text fontFamily="Inter" fontSize={30}>
            :
          </Text>
        </Stack>

        <Stack>
          <ScrollView
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            style={{
              height: ITEM_HEIGHT * 3,
              overflow: "hidden",
            }}
            onScroll={(event) => {
              const offsetY = event.nativeEvent.contentOffset.y;
              const index = Math.round(offsetY / ITEM_HEIGHT);
              const minute = options
                .filter((option) => option.hasOwnProperty(selectedHour))
                .map((option) => option[selectedHour])
                .flat();
              setSelectedMinute(minute[index].toString());
            }}
            snapToInterval={ITEM_HEIGHT}
          >
            <View style={{ height: ITEM_HEIGHT }} />
            {options
              .filter((option) => option.hasOwnProperty(selectedHour))
              .map((option) => option[selectedHour])
              .flat()
              .map((minute, index) => (
                <View
                  key={index}
                  style={{ height: ITEM_HEIGHT, justifyContent: "center" }}
                >
                  <Text fontFamily="Inter" fontSize={30}>
                    {minute.toString().padStart(2, "0")}
                  </Text>
                </View>
              ))}
            <View style={{ height: ITEM_HEIGHT }} />
          </ScrollView>
        </Stack>
        <LinearGradient
          colors={["rgba(255, 255, 255, 3)", "transparent"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: ITEM_HEIGHT,
          }}
        />
        <LinearGradient
          colors={["transparent", "rgba(255, 255, 255, 3)"]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: ITEM_HEIGHT,
          }}
        />
      </XStack>
    </ModalOverlay>
  );
};

export default TimePickerScroll;
