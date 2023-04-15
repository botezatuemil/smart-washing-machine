import { IP, PORT } from "@env";
import axios, { AxiosError } from "axios";
import { LogBox } from "react-native";
import { WashingOption } from "../../../interfaces";

const url = `http://${IP}:${PORT}/getDevicesSelect`;

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export const getDevicesSelect = async (option: WashingOption) => {
  try {
    const {data} = await axios.post(url, {option});
    console.log(data)
    return data;
  } catch (error) {
    const message = (error as AxiosError)?.response?.data as string;
    console.log(message)
  }
};
