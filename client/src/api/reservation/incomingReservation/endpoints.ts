import { IP, PORT } from "@env";
import axios, { AxiosError, AxiosResponse } from "axios";
import { LogBox } from "react-native";
import { useLoginStore } from "../../../store/LoginStore";
const url = `http://${IP}:${PORT}/getIncomingReservation`;

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export const getIncomingReservation = async (token: string) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        " x-access-token": token,
      },
    });
    console.log("data", data);
    return data;
  } catch (error) {
    const message = (error as AxiosError)?.response?.data as string;
    console.log(message);
    throw new Error(message);
  }
};
