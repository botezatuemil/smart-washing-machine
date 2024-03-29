import { IP, PORT } from "@env";
import axios, { AxiosError } from "axios";
import { LogBox } from "react-native";
import { QRRequestType } from "./authQR.const";
const url = `http://${IP}:${PORT}/sendQR`;

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export const sendQR = async (request: QRRequestType) => {
  try {
    const { data } = await axios.post(
      url,
      {id: request.reservationId, expoPushToken: request.expoPushToken, user_id: request.user_id},
      {
        headers: {
          "x-access-token": request.token,
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
