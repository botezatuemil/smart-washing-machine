import { IP, PORT } from "@env";
import axios, { AxiosError, AxiosResponse } from "axios";
import { LoginRequestType } from "../../screens/Auth/Auth.const";
import { LogBox } from "react-native";
const url = `http://${IP}:${PORT}/login`;

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export const login = async (userCredidentials: LoginRequestType) => {

  try {
    const {data} = await axios.post(url, userCredidentials);
    return data;
  } catch (error ) {
    const message = (error as AxiosError)?.response?.data as string;
    throw new Error(message)
  }
 
};
