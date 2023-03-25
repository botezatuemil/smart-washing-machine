import React, { useState, useCallback, useMemo } from "react";
import { YStack, XStack, Button, Form, Input, Stack } from "tamagui";
import { Text } from "tamagui";
import * as styles from "./Reservation.styles";
import { useForm, Controller } from "react-hook-form";
import SelectInput from "../../../components/common/SelectInput/SelectInput";
import { FormReservation } from "./Reservation.const";
import { SelectInputElements, SelectType } from "./Reservation.const";
import { Pressable } from "react-native";
import DateTimePickerSelect from "../../../components/common/DateTimePicker/DateTimePicker";
import SuccessfulReservation from "../../../components/common/Modal/DialogSuccesfullReservation/SuccessfulReservation";
import ModalOverlay from "../../../components/common/Modal/ModalOverlay";

const selectElements: SelectInputElements[] = [
  { key: "laundry", label: "Select Laundry" },
  { key: "washingMachine", label: "Pick a washing machine" },
  { key: "date", label: "Choose an available date" },
  { key: "timeSlot", label: "Pick an available time slot" },
  { key: "time", label: "Choose the start hour and end hour" },
];

const Reservations = () => {
  const [focusColor, setFocusColor] = useState({
    wash: "#0055EE",
    dry: "#8C90A2",
  });

  const onSelectedWashing = () => {
    setFocusColor({ wash: "#0055EE", dry: "#8C90A2" });
  };

  const onSelectedDrying = () => {
    setFocusColor({ dry: "#0055EE", wash: "#8C90A2" });
  };

  const [firstDate, _] = useState<string>(new Date().toDateString());
  const [onOpenDate, setOnOpenDate] = useState<boolean>(false);
  const [onOpenAlert, setOnOpenAlert] = useState<boolean>(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    getValues,
    setValue,
  } = useForm<FormReservation>();


  const handleOpenSelect = (key: SelectType) => {};
  const closeOpenDate = () => {
    setOnOpenDate(false);
  };
  const openDate = () => {
    setOnOpenDate(true);
  };
  
  

  // const openTime = () => {
  //   setOnOpenTime(true);
  // }

  const openAlert = () => {
    setOnOpenAlert(true);
  };

  const closeAlertModal = () => {
    setOnOpenAlert(false);
  };

  const renderInputElements = 
   (
      key: SelectType,
      onChange: () => void,
      value: string | Date
    ): React.ReactElement => {

      switch (key) {
        case "date":
          const { date } = getValues();
          return (
            <>
              <Pressable onPress={openDate}>
                <Input
                  value={date ? date.toDateString() : firstDate}
                  editable={false}
                />
              </Pressable>
              <DateTimePickerSelect
                isShowing={onOpenDate}
                closeModal={closeOpenDate}
                onChangeDate={(selectedDate: any) =>
                  setValue("date", selectedDate)
                }
              />
            </>
          );
        case "time":
          return (
            <>
              <Pressable onPress={openAlert}>
                <Input
                  value={date ? date.toDateString() : firstDate}
                  editable={false}
                />
              </Pressable>

              {/* <SuccessfulReservation /> */}
              {/* isOpen={onOpenAlert} closeModal={closeAlertModal} */}
            </>
          );
        default:
          return (
            <SelectInput
              onChange={onChange}
              value={value as string}
              onOpen={() => handleOpenSelect(key)}
            />
          );
      }
    }
    

  const renderReservationForm = useMemo(() => {
    const onSubmit = (data: FormReservation) => {
      // console.log(watch("date"));
      // openTime();
      openAlert();
      console.log(watch("date"));
    };

    console.log("rendered")

    return (
      <Form
        w="100%"
        h="85%"
        paddingHorizontal={27}
        onSubmit={handleSubmit((data) => onSubmit(data))}
      >
        {selectElements.map((select) => (
          <YStack w="100%" mt={20} space={4} key={select.key}>
            <Text {...styles.label}>{select.label}</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) =>
                renderInputElements(select.key, onChange, value)
              }
              name={select.key}
            />
          </YStack>
        ))}

        <YStack alignSelf="flex-end" w="100%" mt="auto" space={20}>
          <Form.Trigger asChild>
            <Button backgroundColor="#0055EE">
              <Text {...styles.text} color="white">
                START
              </Text>
            </Button>
          </Form.Trigger>
        </YStack>
      </Form>
    );
  }, [onOpenDate]);

  return (
    <YStack w="100%" h="100%" overflow="visible" >
      <XStack
        w="100%"
        justifyContent="space-between"
        mt={30}
        paddingHorizontal={27}
      >
        <Button
          w="49%"
          onPress={onSelectedWashing}
          color={focusColor.wash}
          borderColor={focusColor.wash}
          borderWidth={focusColor.wash === "#0055EE" ? 2 : 0}
          {...styles.text}
        >
          Wash
        </Button>
        <Button
          w="49%"
          onPress={onSelectedDrying}
          color={focusColor.dry}
          borderColor={focusColor.dry}
          borderWidth={focusColor.dry === "#0055EE" ? 2 : 0}
          {...styles.text}
        >
          Dry
        </Button>
      </XStack>
      {renderReservationForm}
      <ModalOverlay isOpen={onOpenAlert} closeModal={closeAlertModal}>
        <Text>asdf</Text>
      </ModalOverlay>
    </YStack>
  );
};

export default Reservations;
