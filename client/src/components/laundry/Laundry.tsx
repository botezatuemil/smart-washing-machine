import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { FlatList } from "react-native";
import { YStack, XStack } from "tamagui";
import { WashingDevice } from "../../interfaces";
import { HomeStackParams } from "../../screens/Home/HomeNavigator";
import Device from "./Device/Device";

type Props = NativeStackScreenProps<HomeStackParams, "Laundry">;

const DATA : WashingDevice[] = [
  {
    id: 1,
    laundry_id: 1,
    name: "M4",
    opened: false,
    status: false,
    student_id: 1,
    type: "WASHING_MACHINE"
  },
  {
    id: 2,
    laundry_id: 1,
    name: "M4",
    opened: false,
    status: false,
    student_id: 1,
    type: "WASHING_MACHINE"
  }
]

const Laundry = ({route} : Props) => {
  return (
    <YStack bg="white" w="100%" h="100%">
       <FlatList
        data={DATA}
        renderItem={({item}) => <Device {...item} />}
       />
    </YStack>
  )
};

export default Laundry;
