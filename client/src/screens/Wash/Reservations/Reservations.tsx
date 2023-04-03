import React, { useState, useCallback, useMemo } from "react";
import { YStack, XStack, Button, Form, Input, Stack } from "tamagui";
import { Text } from "tamagui";
import * as styles from "./Reservation.styles";
import { useForm, Controller } from "react-hook-form";
import SelectInput from "../../../components/common/SelectInput/SelectInput";
import { FormReservation, Item, LaundryType } from "./Reservation.const";
import { SelectInputElements, SelectType } from "./Reservation.const";
import { Pressable } from "react-native";
import DateTimePickerSelect from "../../../components/common/DateTimePicker/DateTimePicker";
import SuccessfulReservation from "../../../components/common/Modal/DialogSuccesfullReservation/SuccessfulReservation";
import TimePicker from "../../../components/common/Modal/TimePicker/TimePicker";
import { useLaundries } from "../../../api/laundry/useLaundry";
import { useDevicesSelect } from "../../../api/washingDevice/getDevicesSelect/useDevicesSelect";
import {  DeviceType, WashingOption } from "../../../interfaces";

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
    setOptionDevice("washing machine")
  };

  const onSelectedDrying = () => {
    setFocusColor({ dry: "#0055EE", wash: "#8C90A2" });
    setOptionDevice("tumble dryer")
  };

  const [firstDate, _] = useState<string>(new Date().toDateString());
  const [openDate, setOpenDate] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [openTime, setOpenTime] = useState<boolean>(false);
  const [items, setItems] = useState<Item>();
  const [optionDevice, setOptionDevice] = useState<WashingOption>("washing machine");

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    getValues,
    setValue,
  } = useForm<FormReservation>();


  const {data: laundries, refetch: refetchLaundry, isLoading: isLoadingLaundries} = useLaundries(); 
  const {data : devices, refetch: refetchDevice ,isLoading: isLoadingDevices} = useDevicesSelect(optionDevice);
  

  const handleOpenSelect =  (key: SelectType) => {
    switch (key) {
      case "washingMachine":
        refetchDevice();
        const valuesDevice = devices?.map(laundry => ({obj: {...laundry}, name: laundry.deviceName }))
        setItems({
          title: "Available Devices",
          values: valuesDevice,
        });
        break;
      case "laundry":
        refetchLaundry();
        const valuesLaundry = laundries?.map(laundry => ({obj: {...laundry}, name: laundry.laundryName + " / floor " + laundry.laundryFloor }))
        setItems({
          title: "Available Laundries",
          values: valuesLaundry,
        });
        
        break;
      case "timeSlot":
        // setItems({
        //   title: "Choose time slot",
        //   values: [
        //     { name: "09:00 - 12:00" },
        //     { name: "14:00 - 15:00" },
        //     { name: "16:00 - 18:00" },
        //     { name: "20:00 - 22:00" },
        //   ],
        // });
    }
  };

  const closeOpenDate = () => {
    setOpenDate(false);
  };
  const onOpenDate = () => {
    setOpenDate(true);
  };

  const onOpenTime = () => {
    setOpenTime(true);
  };

  const closeTime = () => {
    setOpenTime(false);
  };

  const onOpenAlert = () => {
    setOpenAlert(true);
  };

  const closeAlertModal = () => {
    setOpenAlert(false);
  };

  const renderInputElements = (
    key: SelectType,
    onChange: () => void,
    value: string | Date | LaundryType
  ): React.ReactElement => {
    switch (key) {
      case "date":
        const { date } = getValues();
        return (
          <>
            <Pressable onPress={onOpenDate}>
              <Input
                value={date ? date.toDateString() : firstDate}
                editable={false}
              />
            </Pressable>
            <DateTimePickerSelect
              isShowing={openDate}
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
            <Pressable onPress={onOpenTime}>
              <Input
                value={value as string}
                editable={false}
              />
            </Pressable>
            <TimePicker
              isOpen={openTime}
              closeModal={closeTime}
              onCancel={closeTime}
              onSave={closeTime}
              onChange={onChange}
            />
          </>
        );
      default:
        return (
          <SelectInput
            onChange={onChange}
            onOpen={() => handleOpenSelect(key)}
            items={items?.values}
            title={items?.title}
          />
        )
    }
  };

  const renderReservationForm = useMemo(() => {
    const onSubmit = (data: FormReservation) => {
      onOpenAlert();
      console.log("submit", watch("laundry"));
      console.log("submit", watch("washingMachine"));
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
  }, [openDate, openTime, items, isLoadingLaundries, isLoadingDevices, optionDevice]);

  return (
    <YStack w="100%" h="100%" overflow="visible">
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
      <SuccessfulReservation
        isOpen={openAlert}
        closeModal={closeAlertModal}
        onSave={closeAlertModal}
        onCancel={closeAlertModal}
      />
    </YStack>
  );
};

export default Reservations;
