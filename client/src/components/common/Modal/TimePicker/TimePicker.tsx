import ModalOverlay from "../ModalLayout/ModalOverlay";
import { Text, YStack, XStack, Input } from "tamagui";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputChangeEventData,
} from "react-native";
import * as styles from "./TimePicker.styles";
import { useState } from "react";
import moment from "moment";
import { HourInterval } from "../../../../interfaces";

type TimePickerProp = {
  isOpen: boolean;
  closeModal: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (item: string) => void;
  day: Date;
  selectedInterval: string;
};

const TimePicker = ({
  isOpen,
  closeModal,
  onSave,
  onCancel,
  onChange,
  day,
  selectedInterval,
}: TimePickerProp) => {
  const [firstHour, setFirstHour] = useState<string>("");
  const [startTime, setStartTime] = useState<moment.Moment>(moment());
  const [endTime, setEndTime] = useState<moment.Moment>(moment());
  const [lastHour, setLastHour] = useState<string>("");

  const [errorsFirstDate, setErrorsFirstDate] = useState<boolean>(false);
  const [errorsLastDate, setErrorsLastDate] = useState<string>();


  const onSaveInput = () => {
    if (!errorsFirstDate && !errorsLastDate) {
      const value = startTime.format("HH:mm") + "-" + endTime.format("HH:mm");
      onChange(value);
      onSave();
    }
  };

  // for start hour check if is lower than the end hour from the selected interval
  const validateFirstDate = (currentHour: moment.Moment) => {
    const parsedInterval = JSON.parse(
      JSON.stringify(selectedInterval)
    ) as HourInterval;
    const currentTimestamp = moment(currentHour).toDate().valueOf();
    const parsedTimestamp = moment(parsedInterval.startHour).valueOf();
    if (currentTimestamp < parsedTimestamp) {
      setErrorsFirstDate(true);
    } else {
      setErrorsFirstDate(false);
    }
  };

  // for end hour check if it's higher than the first hour
  // check if it's lower than the end interval
  // check if it's no more than 3 hours apart from the first hour

  const validateLastDate = (currentHour: moment.Moment) => {
    const parsedInterval = JSON.parse(
      JSON.stringify(selectedInterval)
    ) as HourInterval;
    const currentTimestamp = moment(currentHour).toDate().valueOf();
    const parsedTimestamp = moment(parsedInterval.endHour).valueOf();
    if (currentTimestamp > parsedTimestamp) {
      setErrorsLastDate("Needs to be lower than the end interval");
    } else if (currentTimestamp < startTime.valueOf()) {
      setErrorsLastDate("Needs to be higher than the start time");
    } else if (currentTimestamp - startTime.valueOf() > 10800000) {
      setErrorsLastDate("Can't be more than 3 hours apart");
    } else {
      setErrorsLastDate(undefined);
    }
  };

  const onChangeFirstMinute = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    let currentHour = moment
      .utc(day)
      .set({ h: Number(firstHour), m: Number(e.nativeEvent.text), s: 0 });
    validateFirstDate(currentHour);
    setStartTime(currentHour);
  };

  const onChangeFirstHour = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setFirstHour(e.nativeEvent.text);
    let currentHour = moment
      .utc(startTime)
      .set({ h: Number(e.nativeEvent.text) });
    validateFirstDate(currentHour);
    setStartTime(currentHour);
  };

  const onChangeLastHour = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setLastHour(e.nativeEvent.text);
    let currentHour = moment
      .utc(endTime)
      .set({ h: Number(e.nativeEvent.text) });
    validateLastDate(currentHour);
  };

  const onChangeLastMinute = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    let currentHour = moment
      .utc(day)
      .set({ h: Number(lastHour), m: Number(e.nativeEvent.text), s: 0 });
    validateLastDate(currentHour);
    setEndTime(currentHour);
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      closeModal={closeModal}
      title={"Time Duration"}
      onSave={onSaveInput}
      onCancel={onCancel}
      saveTitle={"Save"}
      cancelTitle={"Cancel"}
      isDisabled={
        errorsFirstDate || (errorsLastDate === undefined ? false : true)
      }
    >
      <YStack paddingTop={20}>
        <XStack alignItems="center" space={20}>
          <Text fontFamily="InterSemi" w={50}>
            From:
          </Text>
          <YStack>
            <XStack alignItems="center" space={10}>
              <YStack alignItems="center">
                <TextInput
                  {...styles.textInput}
                  multiline={false}
                  keyboardType="number-pad"
                  textAlign="center"
                  onChange={onChangeFirstHour}
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
                  onChange={onChangeFirstMinute}
                />
                <Text {...styles.labelTime}>Minute</Text>
              </YStack>
            </XStack>
          </YStack>
        </XStack>
        {errorsFirstDate && (
          <Text {...styles.errors}>
            Needs to be higher than the selected interval!
          </Text>
        )}

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
                onChange={onChangeLastHour}
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
                onChange={onChangeLastMinute}
              />
              <Text {...styles.labelTime}>Minute</Text>
            </YStack>
          </XStack>
        </XStack>
        {errorsLastDate && <Text {...styles.errors}>{errorsLastDate}</Text>}
      </YStack>
    </ModalOverlay>
  );
};

export default TimePicker;
