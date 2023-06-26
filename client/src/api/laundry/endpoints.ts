import axios, { AxiosError } from "axios";
import { LogBox } from "react-native";
import { IP, PORT } from "@env";

const url = `http://${IP}:${PORT}/getLaundries`;

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export const getLaundries = async () => {
  try {
    const {data} = await axios.get(url);
    console.log(data)
    return data;
  } catch (error) {
    const message = (error as AxiosError)?.response?.data as string;
    console.log("error", message)
  }
};
