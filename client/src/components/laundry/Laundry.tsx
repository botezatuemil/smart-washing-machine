import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { FlatList } from "react-native";
import { YStack } from "tamagui";
import { WashingDevice } from "../../interfaces";
import { HomeStackParams } from "../../screens/Home/HomeNavigator";
import Device from "./Device/Device";
import {Dimensions} from 'react-native';

const windowHeight = Dimensions.get('window').height;

type Props = NativeStackScreenProps<HomeStackParams, "Laundry">;

const DATA: WashingDevice[] = [
  {
    id: 1,
    laundry_id: 1,
    name: "M4",
    opened: false,
    status: false,
    student_id: 1,
    type: "WASHING_MACHINE",
  },
  {
    id: 2,
    laundry_id: 1,
    name: "M4",
    opened: false,
    status: false,
    student_id: 1,
    type: "WASHING_MACHINE",
  },
];

const Laundry = ({ route }: Props) => {
  return (
    <YStack bg="white" w="100%">
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Device {...item} />}
        snapToAlignment={"start"}
        decelerationRate={"fast"}
        snapToInterval={windowHeight}
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  );
};

export default Laundry;
