import { IP, PORT } from "@env";
import axios, { AxiosError, AxiosResponse } from "axios";
import { LogBox } from "react-native";
import { QRRequestType } from "./authQR.const";
const url = `http://${IP}:${PORT}/sendQR`;

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export const sendQR = async (request: QRRequestType) => {
  try {
    const { data } = await axios.post(
      url,
      {id: request.reservationId},
      {
        headers: {
          "x-access-token": request.token,
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
