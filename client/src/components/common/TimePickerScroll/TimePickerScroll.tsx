import React, { useState, useEffect, useRef } from "react";
import { ScrollView, Text, Stack, XStack, YStack } from "tamagui";
import { Dimensions, View } from "react-native";
import ModalOverlay from "../Modal/ModalLayout/ModalOverlay";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";

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
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<string>("");
  const [interval, setSelectedInterval] = useState<string>(selectedInterval);
  const [options, setOptions] = useState<Record<string, number[]>[]>([]);
  const [selectedHour, setSelectedHour] = useState(
    parseInt(selectedInterval?.split(" - ")[0]?.split(":")[0])
  );
  const [selectedMinute, setSelectedMinute] = useState(
    parseInt(selectedInterval?.split(" - ")[0]?.split(":")[1])
  );

  const createOptions = (
    startHour: number,
    endHour: number,
    startMinute: number,
    endMinute: number
  ) => {
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
    setOptions(options);
  };

  const generateData = () => {
    const startHour = parseInt(interval?.split(" - ")[0]?.split(":")[0]);
    const startMinute = parseInt(interval?.split(" - ")[0]?.split(":")[1]);
    const endHour = parseInt(interval?.split(" - ")[1]?.split(":")[0]);
    const endMinute = parseInt(interval?.split(" - ")[1]?.split(":")[1]);
    createOptions(startHour, endHour, startMinute, endMinute);
  };

  useEffect(() => {
    setSelectedInterval(selectedInterval);
    generateData();
  }, []);

  useEffect(() => {
    generateData();
  }, [interval]);

  useEffect(() => {
    const minute = options
      .filter((option) =>
        option.hasOwnProperty(selectedHour.toString().padStart(2, "0"))
      )
      .map((option) => option[selectedHour.toString().padStart(2, "0")])
      .flat();
    setSelectedMinute(minute[0]);
  }, [options, selectedHour]);

  const hourScrollViewRef = React.useRef<any>();
  const minuteScrollViewRef = React.useRef<any>();

  const validateData = (start: moment.Moment, end: moment.Moment) => {
    const difference = moment.duration(end.diff(start)).asMinutes();

    if (difference > 181) {
      setErrors("The chosen interval is too large!");
      return;
    }
    if (difference < 20) {
      setErrors("The chosen interval is too small!");
      return;
    }
    setErrors("");
    closeModal();
  };

  const onSaveInput = () => {
    if (step === 0) {
      setSelectedInterval(
        selectedHour.toString().padStart(2, "0") +
          ":" +
          selectedMinute.toString().padStart(2, "0") +
          " - " +
          interval?.split(" - ")[1]?.split(":")[0].toString().padStart(2, "0") +
          ":" +
          interval?.split(" - ")[1]?.split(":")[1].toString().padStart(2, "0")
      );
      setStep((step) => step + 1);
      hourScrollViewRef.current?.scrollTo({ y: 0, animated: true });
      minuteScrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
    if (step === 1) {
      onChange(
        interval?.split(" - ")[0]?.split(":")[0].toString().padStart(2, "0") +
          ":" +
          interval?.split(" - ")[0]?.split(":")[1].toString().padStart(2, "0") +
          " - " +
          selectedHour.toString().padStart(2, "0") +
          ":" +
          selectedMinute.toString().padStart(2, "0")
      );

      validateData(
        moment
          .utc()
          .hour(parseInt(interval?.split(" - ")[0]?.split(":")[0]))
          .minute(parseInt(interval?.split(" - ")[0]?.split(":")[1])),
        moment.utc().hour(selectedHour).minute(selectedMinute)
      );
    }
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      closeModal={closeModal}
      title={step === 0 ? "Start Hour" : "End Hour"}
      onSave={onSaveInput}
      onCancel={closeModal}
      saveTitle={step === 0 ? "Next" : "Save"}
      cancelTitle={"Cancel"}
    >
      {options && (
        <YStack>
          <XStack w="100%" ai="center" justifyContent="center">
            <Stack>
              <ScrollView
                ref={hourScrollViewRef}
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
                  setSelectedHour(parseInt(Object.keys(options[index])[0]));
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
                      {Object.keys(hour)[0].toString().padStart(2, "0")}
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
                ref={minuteScrollViewRef}
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
                    .filter((option) =>
                      option.hasOwnProperty(
                        selectedHour.toString().padStart(2, "0")
                      )
                    )
                    .map(
                      (option) =>
                        option[selectedHour.toString().padStart(2, "0")]
                    )
                    .flat();
                  setSelectedMinute(minute[index]);
                }}
                snapToInterval={ITEM_HEIGHT}
              >
                <View style={{ height: ITEM_HEIGHT }} />
                {options
                  .filter((option) =>
                    option.hasOwnProperty(
                      selectedHour.toString().padStart(2, "0")
                    )
                  )
                  .map(
                    (option) => option[selectedHour.toString().padStart(2, "0")]
                  )
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
          {errors !== "" && (
            <Text fontFamily="InterSemi" color="red">
              {errors}
            </Text>
          )}
        </YStack>
      )}
    </ModalOverlay>
  );
};

export default TimePickerScroll;
