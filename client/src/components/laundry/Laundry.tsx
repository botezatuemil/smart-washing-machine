import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { FlatList } from "react-native";
import { YStack } from "tamagui";
import { WashingDevice } from "../../interfaces";
import { HomeStackParams } from "../../screens/Home/HomeNavigator";
import Device from "./Device/Device";
import { Dimensions } from "react-native";
import axios from "axios";
import { useDevices } from "../../api/washingDevice/getAllDevices/useDevices";

const windowHeight = Dimensions.get("window").height;

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
  const { data } = useDevices(route.params.option);
  const path: string =
    route.params.option === "washing machine"
      ? require(`../../assets/images/WashingMachineModel.png`)
      : require(`../../assets/images/TumbleDryerModel.png`);

  return (
    <YStack bg="white" w="100%">
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Device {...item} type={route.params.option} imagePath={path} />
        )}
        snapToAlignment={"start"}
        decelerationRate={"fast"}
        snapToInterval={windowHeight}
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  );
};

export default Laundry;
