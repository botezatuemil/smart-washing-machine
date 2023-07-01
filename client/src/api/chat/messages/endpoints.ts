import { IP, PORT } from "@env";
import axios, { AxiosError } from "axios";
import { LogBox } from "react-native";
import { RequestMessage } from "./messages.const";
const url = `http://${IP}:${PORT}/getMessages`;

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export const getMessages = async (input: RequestMessage) => {
  try {
    const { data } = await axios.post(
      url,
      {conversationId: input.conversationId},
      {
        headers: {
          "x-access-token": input.token,
        },
      }
    );
    return data;
  } catch (error) {
    const message = (error as AxiosError)?.response?.data as string;
    console.log(message);
    throw new Error(message);
  }
};