import { IP, PORT } from "@env";
import axios, { AxiosError } from "axios";
import { LogBox } from "react-native";
import { WashingOption } from "../../../interfaces";

const url = `http://${IP}:${PORT}/getLaundryDevices`;

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export const getAllDevices = async (option: WashingOption) => {
  try {
    const {data} = await axios.post(url, {option});
    return data;
  } catch (error) {
    const message = (error as AxiosError)?.response?.data as string;
    console.log(message)
    throw new Error(message)
  }
};
