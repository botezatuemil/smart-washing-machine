import React, { useState, useEffect } from "react";
import { YStack, XStack, Button, Form, Input} from "tamagui";
import { Text } from "tamagui";
import * as styles from "./Reservation.styles";
import { useForm, Controller } from "react-hook-form";
import SelectInput from "../../../components/common/SelectInput/SelectInput";
import {
  FormReservation,
  Item,
  LaundryType,
  ReservationRequestType,
} from "./Reservation.const";
import { SelectInputElements, SelectType } from "./Reservation.const";
import { Pressable } from "react-native";

import SuccessfulReservation from "../../../components/common/Modal/DialogSuccesfullReservation/SuccessfulReservation";
import { useLaundries } from "../../../api/laundry/useLaundry";
import { useDevicesSelect } from "../../../api/washingDevice/getDevicesSelect/useDevicesSelect";
import { HourInterval, WashingOption } from "../../../interfaces";
import { useAvailableHours } from "../../../api/reservation/reservationHours/useAvailableHours";
import TimePickerScroll from "../../../components/common/TimePickerScroll/TimePickerScroll";

import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { changeTimeZone } from "../../../utils/TimeZone";

const selectElements: SelectInputElements[] = [
  { key: "laundry", label: "Select Laundry" },
  { key: "washingMachine", label: "Pick a washing machine" },
  { key: "date", label: "Choose an available date" },
  { key: "timeSlot", label: "Pick an available time slot" },
  { key: "time", label: "Choose the start hour and end hour" },
];

type Props = {
  laundry: Item | undefined;
  washingDevice: Item| undefined;
};

const Reservations = ({ laundry, washingDevice }: Props) => {
  const [focusColor, setFocusColor] = useState({
    wash: "#0055EE",
    dry: "#8C90A2",
  });

  const onSelectedWashing = () => {
    setFocusColor({ wash: "#0055EE", dry: "#8C90A2" });
    setOptionDevice("washing machine");
  };

  const onSelectedDrying = () => {
    setFocusColor({ dry: "#0055EE", wash: "#8C90A2" });
    setOptionDevice("tumble dryer");
  };

  const [firstDate, setFirstDate] = useState<Date>(new Date());
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [openTime, setOpenTime] = useState<boolean>(false);
  const [formData, setFormData] = useState<
    ReservationRequestType | undefined
  >();


  const [optionDevice, setOptionDevice] =
    useState<WashingOption>("washing machine");

  useEffect(() => {
    if (washingDevice?.washingOption) {
      setOptionDevice(washingDevice.washingOption);
      setFocusColor({
        wash:
          washingDevice.washingOption === "washing machine"
            ? "#0055EE"
            : "#8C90A2",
        dry:
          washingDevice.washingOption === "tumble dryer"
            ? "#0055EE"
            : "#8C90A2",
      });
    }
  }, [washingDevice?.washingOption]);

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
  } = useForm<FormReservation>({
    defaultValues: {
      date: changeTimeZone(new Date()),
      laundry: laundry ? laundry.values[0].id.toString() : "",
      washingMachine:  washingDevice ?  washingDevice.values[0].id.toString() : ""
    },
  });


  const { items: laundries, refetch: refetchLaundry } = useLaundries();
  const { items: devices, refetch: refetchDevice } =
    useDevicesSelect(optionDevice, watch("laundry"));
  const { items: availableHours, refetch: refetchAvailableHours } =
    useAvailableHours(watch("date"));

  const onOpenDate = () => {
    DateTimePickerAndroid.open({
      value: firstDate,
      onChange: (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setFirstDate(currentDate);
        setValue("date", changeTimeZone(currentDate));
      },
      mode: "date",
      is24Hour: true,
      firstDayOfWeek: 1,
      minimumDate: new Date(),
    });
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

  const isCompleted = watch("laundry") && watch("washingMachine") && watch("date") && watch("time") && watch("timeSlot");
  const isFormValid = Object.keys(errors).length === 0 && isCompleted;

  const handleOpen = (field: SelectType) => {
    switch (field) {
      case "laundry":
        refetchLaundry();
        break;
      case "washingMachine":
        if (watch("laundry") !== '') {
          refetchDevice();
        } else {
          setError("laundry", {
            type: "required",
            message: `Please complete the laundry field`,
          });
        }
        break;
      case "timeSlot":
        if (watch("laundry") !== '' && watch("washingMachine") !== '') {
          refetchAvailableHours();
        } else {

           if (watch("laundry") === "") {
            setError("laundry", {
              type: "required",
              message: `Please complete the laundry field`,
            });
          }
          if (watch("washingMachine") === "") {
            setError("washingMachine", {
              type: "required",
              message: `Please complete the washing device field`,
            });
          }
        }
        break;
        case "time": 
        if (watch("laundry")  !== ''&& watch("washingMachine") !== '' && watch("timeSlot") !== '') {
          onOpenTime();
        } else  {
          if (watch("laundry") === "") {
            setError("laundry", {
              type: "required",
              message: `Please complete the laundry field`,
            });
          }
          if (watch("washingMachine") === "") {
            setError("washingMachine", {
              type: "required",
              message: `Please complete the washing device field`,
            });
          }
          if (watch("timeSlot") === "") {
            setError("timeSlot", {
              type: "required",
              message: `Please complete the washing device field`,
            });
          }
          
        }
        break;
      default:
        break;
    }
  };

  const renderInputElements = (
    key: SelectType,
    onChange: () => void,
    value: string | Date | LaundryType | HourInterval
  ): React.ReactElement => {
    switch (key) {
      case "date":
        const { date } = getValues();
        return (
          <Pressable onPress={onOpenDate}>
            <Input
              value={date ? date.toDateString() : new Date().toDateString()}
              editable={false}
            />
          </Pressable>
        );
      case "time":
        const { timeSlot } = getValues();
        return (
          <>
            <Pressable onPress={() => handleOpen(key)}>
              <Input
                placeholder="Select time"
                value={value as string}
                editable={false}
              />
            </Pressable>
            {openTime && (
              <TimePickerScroll
                isOpen={openTime}
                closeModal={closeTime}
                selectedInterval={timeSlot}
                onChange={(time) => setValue("time", time)}
              />
            )}
          </>
        );
      case "laundry":
        return (
          <>
            <SelectInput
              placeholder="Choose a laundry"
              onChange={onChange}
              onOpen={handleOpen}
              defaultValue={laundry}
              items={laundries}
              field={key}
              clearErrors={clearErrors}
              errors={false}
              showErrorBorder={errors.laundry ? true : false}
              errorMessage=""
            />
          </>
        );
      case "washingMachine":
        return (
          <>
            <SelectInput
              placeholder="Available washing devices"
              onChange={onChange}
              onOpen={handleOpen}
              items={devices}
              defaultValue={washingDevice}
              field={key}
              clearErrors={clearErrors}
              errors={errors.laundry ? true : false}
              errorMessage={`${
                errors.laundry && "Please select a laundry first"
              }`}
              showErrorBorder={errors.washingMachine ? true : false}
            />
          </>
        );
      default:
        return (
          <SelectInput
            placeholder="Choose an available hour interval"
            onChange={onChange}
            onOpen={handleOpen}
            items={availableHours}
            field={key}
            clearErrors={clearErrors}
            errors={errors.laundry || errors.washingMachine ? true : false}
            errorMessage={`${
              errors.laundry !== undefined &&
              errors.washingMachine !== undefined
                ? "Please select a laundry and a washing device first"
                : errors.laundry !== undefined
                ? "Please select a laundry first"
                : "Please select a washing device first"
            }`}
            showErrorBorder={errors.timeSlot ? true : false}
          />
        );
    }
  };


  const renderReservationForm = () => {
    const onSubmit = (data: FormReservation) => {
      onOpenAlert();
      setFormData(data);
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
          <Form.Trigger asChild  disabled={!isFormValid}>
            <Button backgroundColor="#0055EE" >
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
      {renderReservationForm()}
      <SuccessfulReservation
        data={formData}
        isOpen={openAlert}
        closeModal={closeAlertModal}
        onCancel={closeAlertModal}
        setValue={setValue}
      />
    </YStack>
  );
};

export default Reservations;
