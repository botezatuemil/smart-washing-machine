import React, { useState } from "react";
import { View, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const MIN_HOUR = 10;
const MAX_HOUR = 13;
const MAX_MINUTE = 30;

type DateTimePropType = {
  isShowing: boolean;
  closeModal: () => void;
  onChangeDate: (selectedDate : any) => void;
};

const DateTimePickerSelect = ({ isShowing, closeModal, onChangeDate }: DateTimePropType) => {

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");

  const showMode = (currentMode: any) => {
    setMode(currentMode);
  };

  const showDatePicker = () => {
    showMode("date");
  };

  const showTimePicker = () => {
    showMode("time");
  };

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    closeModal();
    setDate(currentDate);
  };

  const getMinDate = () => {
    const minDate = new Date();
    // minDate.setHours(MIN_HOUR, 0, 0, 0);
    return minDate;
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    // maxDate.setHours(MAX_HOUR, MAX_MINUTE, 0, 0);
    return maxDate;
  };

  return (
    <View>
      {isShowing && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={(event :any, selectedDate:any) => {
            onChange(event, selectedDate); onChangeDate(selectedDate);
          }}
          // minimumDate={getMinDate()}
          // maximumDate={getMaxDate()}
        />
      )}
    </View>
  );
};

export default DateTimePickerSelect;
