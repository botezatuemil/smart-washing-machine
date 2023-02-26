import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import io from "socket.io-client"
import {PORT, IP} from "@env";

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

    setInterval(() => {
      socket.emit('heartbeat');
    }, 3000);

    return () => {
      socket.disconnect();
    }
  },[])


  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text>{status}</Text>
      <Text>{socketMessage}</Text>
    </View>
  );
};

export default Profile;
