import React from "react";
import { YStack, Text, XStack, Stack, Button, Image } from "tamagui";
import { WashingDevice, WashingOption } from "../../../interfaces";
import * as styles from "./Device.styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Dimensions } from "react-native";
import { Laundry } from "../../../api/washingDevice/getAllDevices/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
// import { WashStackParams } from "../../../screens/Wash/WashNavigator";
import { RootStackParams } from "../../../navigation/TabNavigator";
import { ChatStackParams } from "../../../screens/Chat/ChatNavigator";
import { useCreateChat } from "../../../api/chat/createChat/useCreateChat";
import { useLoginStore } from "../../../store/LoginStore";
import {Item, LaundryType} from "../../../screens/Wash/Reservations/Reservation.const";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Device = ({
  studentId,
  dormFloor,
  dormId,
  dormNumber,
  firstName,
  lastName,
  laundryFloor,
  laundryId,
  opened,
  status,
  washingDeviceId,
  washingDeviceName,
  type,
  imagePath,
  laundryName
}: Laundry & { type: WashingOption } & { imagePath: string }) => {
  // const navigationWash =
    // useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const navigationRoot =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const createChat = useCreateChat();
  const { token } = useLoginStore();
  const getStatus = () => {
    if (status && opened) {
      return ["FREE", "#50BF6F"];
    }

    if (!opened) {
      return ["NOT OPENED", "#FFB800"];
    }

    if (!status) {
      return ["BUSY", "#FF0000"];
    }
    return [];
  };

  const onStartChat = async () => {
    createChat.mutate({ token, receiverId: studentId });

    navigationRoot.navigate("ChatStack");
  };

  const navigateToReserve = () => {
    let valuesLaundry = [];
    let valuesWashingDevice = [];

    valuesLaundry.push({id: laundryId, name: laundryName + " / floor " + laundryFloor}) ;
    valuesWashingDevice.push({id: washingDeviceId, name: washingDeviceName})

    const laundryItem : Item = {
      title: "Available Laundries",
      values: valuesLaundry,
    };

    const washingDeviceItem : Item = {
      title: "Available Devices",
      values: valuesWashingDevice
    }

    navigationRoot.navigate("WashStack", {laundry: laundryItem, washingDevice : washingDeviceItem});
    // navigationRoot.navigate("WashStack", {screen: "Wash", params: {}}).navigationWash.navigate("Wash", {laundry: laundryItem})
  }

  return (
    <YStack w="100%" h={windowHeight} alignItems="center">
      <XStack w="100%" justifyContent="center" space={8} alignItems="center">
        <Stack bg={`${getStatus()[1]}`} w={10} h={10} borderRadius={100} />
        <Text fontFamily="InterBold" color={`${getStatus()[1]}`}>
          {getStatus()[0]}
        </Text>
      </XStack>
      <YStack marginTop={24} w="100%">
        <XStack
          justifyContent="space-between"
          paddingHorizontal={36}
          alignItems="center"
        >
          <Text {...styles.header}>DETAILS:</Text>
        </XStack>
        <XStack justifyContent="space-between" paddingHorizontal={36}>
          <YStack space={10}>
            <YStack>
              <Text {...styles.header}>
                {lastName} {firstName}
              </Text>
              <Text {...styles.text}>
                {dormNumber} / {dormFloor} floor
              </Text>
            </YStack>
          </YStack>
          <YStack space={10}>
            <YStack>
              <Text {...styles.header}>Laundry {laundryId}</Text>
              <Text {...styles.text}>
                {washingDeviceName} / {laundryFloor} floor
              </Text>
            </YStack>
          </YStack>
        </XStack>
      </YStack>
      <Image marginTop={36} src={imagePath} height={400} width={300} />
      <YStack
        w="100%"
        paddingHorizontal={36}
        mt={60}
        justifyContent="center"
        space={9}
      >
        <Button
          {...styles.textButton}
          bg="#0055EE"
          w="100%"
          onPress={navigateToReserve}
        >
          RESERVE
        </Button>
        <Button
          {...styles.textButton}
          color="white"
          bg="black"
          w="100%"
          icon={<Ionicons size={16} name="chatbubble-outline" />}
          onPress={onStartChat}
        >
          CHAT
        </Button>
      </YStack>
    </YStack>
  );
};

export default Device;
