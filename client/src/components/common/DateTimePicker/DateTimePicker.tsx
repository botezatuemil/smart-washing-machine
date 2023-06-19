import React, { useState } from "react";
import { View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

type DateTimePropType = {
  isShowing: boolean;
  closeModal: () => void;
  onChangeDate: (selectedDate : any) => void;
};

export const changeTimeZone = (date: Date) => {
  const currentDate = date;
  const difference = -currentDate.getTimezoneOffset() / 60
  currentDate.setHours(currentDate.getHours() + difference);
  return currentDate;
}
const DateTimePickerSelect = ({ isShowing, closeModal, onChangeDate }: DateTimePropType) => {

  const [date, setDate] = useState(new Date());


  const onChangeHandler = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    // const parsedDate = changeTimeZone(currentDate)
    // console.log("parse", currentDate)
    setDate(currentDate);
    onChangeDate(currentDate); 
    closeModal();
  };


  return (
    <View>
      {isShowing && (
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          timeZoneOffsetInMinutes={-180}
          onChange={onChangeHandler}
          // minimumDate={new Date()}
        />
      )}
    </View>
  );
};

export default DateTimePickerSelect;
