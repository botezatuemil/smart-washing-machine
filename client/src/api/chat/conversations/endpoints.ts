import axios, { AxiosError } from "axios";
import { LogBox } from "react-native";
import { IP, PORT } from "@env";

const url = `http://${IP}:${PORT}/getConversations`;

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();



export const getConversations = async (token: string) => {
    try {
        const { data } = await axios.get(url, {
          headers: {
            " x-access-token": token,
          },
        });
        return data;
      } catch (error) {
        const message = (error as AxiosError)?.response?.data as string;
        console.log(message);
        throw new Error(message);
      }
};