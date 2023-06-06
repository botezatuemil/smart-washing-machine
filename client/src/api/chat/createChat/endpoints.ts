import { IP, PORT } from "@env";
import axios, { AxiosError, AxiosResponse } from "axios";
import { LogBox } from "react-native";
import { ChatRequest } from "./useCreateChat";
const url = `http://${IP}:${PORT}/createChat`;

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export const createChat = async ({receiverId, token} : ChatRequest) => {
  try {
    const { data } = await axios.post(
      url,
      {receiverId},
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    console.log(data)
    return data;
  } catch (error) {
    const message = (error as AxiosError)?.response?.data as string;
    console.log(message);
    throw new Error(message);
  }
};
