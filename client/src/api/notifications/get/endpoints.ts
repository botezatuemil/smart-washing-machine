import { IP, PORT } from "@env";
import axios, { AxiosError } from "axios";
import moment from "moment";
import { LogBox } from "react-native";
const url = `http://${IP}:${PORT}/getNotifications`;

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export type Notification = {
  id: number;
  student_id: number;
  title: string;
  subtitle: string;
  timestamp: moment.Moment;
};

export const getNotifications = async (token: string) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "x-access-token": token,
      },
    });
    return data;
  } catch (error) {
    const message = (error as AxiosError)?.response?.data as string;
    console.log(message);
    throw new Error(message);
  }
};
