import React, { useState } from "react";
import { View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type DateTimePropType = {
  isShowing: boolean;
  closeModal: () => void;
  onChangeDate: (selectedDate : any) => void;
};

const DateTimePickerSelect = ({ isShowing, closeModal, onChangeDate }: DateTimePropType) => {

  const [date, setDate] = useState(new Date());

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    const difference = -currentDate.getTimezoneOffset() / 60
    currentDate.setHours(currentDate.getHours() + difference)
    closeModal();
    setDate(currentDate);
  };


  return (
    <View>
      {isShowing && (
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={(event :any, selectedDate:any) => {
            onChange(event, selectedDate); onChangeDate(selectedDate);
          }}
          // minimumDate={new Date()}
        />
      )}
    </View>
  );
};

export default DateTimePickerSelect;
