import React, { useState } from "react";
import { YStack, XStack, Button, Form, Input, Stack } from "tamagui";
import { Text } from "tamagui";
import * as styles from "./Reservation.styles";
import { useForm, Controller } from "react-hook-form";
import SelectInput from "../../../components/laundry/common/SelectInput";
import { FormReservation } from "./Reservation.const";
import { SelectInputElements, SelectType } from "./Reservation.const";

const selectElements: SelectInputElements[] = [
  { key: "laundry", label: "Select Laundry" },
  { key: "washingMachine", label: "Pick a washing machine" },
  { key: "startHour", label: "Pick the start hour" },
  { key: "endHour", label: "Pick the end hour" },
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

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<FormReservation>();

  const renderReservationForm = () => {
    const onSubmit = (data: FormReservation) => {
   
    };

    const handleOpenSelect = (key: SelectType) => {
    };

    return (
      <Form
        w="100%"
        h="85%"
        paddingHorizontal={27}
        onSubmit={handleSubmit((data) => onSubmit(data))}
      >
        {selectElements.map((select) => (
          <YStack w="100%" mt={28} space={4} key={select.key}>
            <Text {...styles.label}>{select.label}</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <SelectInput
                  onChange={onChange}
                  value={value}
                  onOpen={() => handleOpenSelect(select.key)}
                />
              )}
              name={select.key}
            />
          </YStack>
        ))}
        <YStack alignSelf="flex-end" w="100%" mt="auto" space={20}>
          <Text {...styles.label}>
          To ensure the validity of a reservation, it is essential to scan the NFC when the designated time period begins. 
          Failure to validate within the first 5 minutes of the reservation will result in automatic cancellation.
          </Text>
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
  };

  return (
    <YStack w="100%" h="100%">
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
      {renderReservationForm()}
    </YStack>
  );
};

export default Reservations;
