import React from "react";
import { YStack, Text, XStack, Stack, Button, Image } from "tamagui";
import { WashingDevice } from "../../../interfaces";
import * as styles from "./Device.styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Device = ({
  id,
  laundry_id,
  name,
  opened,
  status,
  student_id,
  type,
}: WashingDevice) => {
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

  return (
    <YStack w="100%" h={windowHeight} alignItems="center" >
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
          <Button
            height={30}
            borderRadius={100}
            bg="black"
            fontFamily="InterSemi"
            color="white"
            fontSize={12}
            icon={<Ionicons size={16} name="chatbubble-outline" />}
          >
            Chat
          </Button>
        </XStack>
        <XStack justifyContent="space-between" paddingHorizontal={36}>
          <YStack space={10}>
            <YStack>
              <Text {...styles.header}>Botezatu Emil</Text>
              <Text {...styles.text}>502A / 03 floor</Text>
            </YStack>
          </YStack>
          <YStack space={10}>
            <YStack>
              <Text {...styles.header}>Laundry 2</Text>
              <Text {...styles.text}>M4 / 03 floor</Text>
            </YStack>
          </YStack>
        </XStack>
      </YStack>

      <Image
      marginTop={36}
        src={require("../../../assets/images/WashingMachineModel.png")}
        height={400}
        width={300}
      />
      <YStack w="100%" paddingHorizontal={36} mt={28} justifyContent="center" space={9}>
        <Button {...styles.textButton} bg="#0055EE" w="100%">RESERVE</Button>
        <Button {...styles.textButton} color="black" bg="#E7E7E9" w="100%"  >USE NOW</Button>
        <Button {...styles.textButton} bg="#060606" w="100%">SEND NOTIFICATION!</Button>
      </YStack>
    </YStack>
  );
};

export default Device;
