import { IP, PORT } from "@env";
import axios, { AxiosError } from "axios";
import { LogBox } from "react-native";
import { ReservationType } from "../../../interfaces";
const url = `http://${IP}:${PORT}/addReservation`;

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export const addReservation = async (reservation : Omit<ReservationType, "id">) => {
  try {
    const {data} = await axios.post(url, {reservation});
    return data;
  } catch (error) {
    const message = (error as AxiosError)?.response?.data as string;
    console.log(message)
  }
 
};
