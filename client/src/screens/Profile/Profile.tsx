import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import io from "socket.io-client"
import {PORT, IP} from "@env";
import { Button, YStack } from 'tamagui'
import * as styles from "./Profile.styles"
const Profile = () => {

  const [status, setStatus] = useState<string>("");
  const [socketMessage, setSocketMessage] = useState<string>();

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
      <Button  {...styles.button}>Lorem ipsum</Button>
    </YStack>
  );
};

export default Profile;
