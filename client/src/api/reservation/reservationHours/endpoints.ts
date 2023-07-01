import { IP, PORT } from "@env";
import axios, { AxiosError } from "axios";
import { LogBox } from "react-native";
const url = `http://${IP}:${PORT}/getAvailableHours`;

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export const getAvailableHours = async (day: Date) => {
  try {
    const {data} = await axios.post(url, {day});
    return data;
  } catch (error) {
    const message = (error as AxiosError)?.response?.data as string;
    console.log(message)
  }
};
