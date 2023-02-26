import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import io from "socket.io-client"

const Profile = () => {

  const [status, setStatus] = useState<string>("");
  const [socketMessage, setSocketMessage] = useState<string>();
  const socket = io("http://192.168.0.111:5000");
 

  useEffect(() => {
   
    socket.on('connect', () => {
      console.log("connected");
      setStatus("connected")
    });

    socket.on('disconnect', () => {
      console.log("disconnected");
    });

    socket.on('washing_machine', (msg) => {
      console.log("Received message: ", msg);
      setSocketMessage(msg)
    });

    return () => {
      socket.close();
    }

  }, [])

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text>{status}</Text>
      <Text>{socketMessage}</Text>
    </View>
  );
};

export default Profile;
