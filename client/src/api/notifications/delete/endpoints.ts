import { IP, PORT } from "@env";
import axios, { AxiosError } from "axios";
import { LogBox } from "react-native";
const url = `http://${IP}:${PORT}/deleteNotification`;

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export type RequestNotificationDelete = {
  notificationId: number;
  token: string;
};
export const deleteNotification = async (request: RequestNotificationDelete) => {
  try {
    const { data } = await axios.post(
      url,
      {
        id: request.notificationId,
      },
      {
        headers: {
          "x-access-token": request.token,
        },
      }
    );
    console.log(data);
    return data;
  } catch (error) {
    const message = (error as AxiosError)?.response?.data as string;
    console.log(message);
    throw new Error(message);
  }
};
