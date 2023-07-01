import { IP, PORT } from "@env";
import axios, { AxiosError } from "axios";
import { LogBox } from "react-native";
const url = `http://${IP}:${PORT}/getProfile`;

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  dormNumber: string;
  dormFloor: number;
  building: number;
  campus: string;
};

export const getProfile = async (token: string) => {
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
