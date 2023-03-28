import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import io from "socket.io-client"
import {PORT, IP} from "@env";
import { Button, YStack } from 'tamagui'
import * as styles from "./Profile.styles"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { DrawerStackParams } from "../../navigation/DrawerNavigation";
import { useLoginStore } from "../../store/LoginStore";
const Profile = () => {

  const [status, setStatus] = useState<string>("");
  const [socketMessage, setSocketMessage] = useState<string>();
  const {toggleLogin} = useLoginStore();
  
  const logout = async() => {
    try {
      await AsyncStorage.removeItem("token");
      toggleLogin(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const socket = io(`http://${IP}:${PORT}`);

    socket.on('connect', () => {
      console.log("connected");
      setStatus("connected")
    });

    socket.on('disconnect', (reason) => {
      console.log("disconnected", reason);
    });

    socket.on('washing_machine', (msg) => {
      console.log("Received message: ", msg);
      setSocketMessage(msg)
    });

    return () => {
      socket.disconnect();
    }
  },[])


  return (
    <YStack display="flex" w="100%" h="100%" ai="center">
      <Text>{status}</Text>
      <Text>{socketMessage}</Text>
      <Button  {...styles.button} onPress={logout}>Log out</Button>
    </YStack>
  );
};

export default Profile;
