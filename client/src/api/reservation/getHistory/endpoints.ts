import axios, { AxiosError } from "axios";
import { LogBox } from "react-native";
import { IP, PORT } from "@env";

const url = `http://${IP}:${PORT}/getHistory`;

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export const getHistory = async (id : React.Key) => {
  try {
    const {data} = await axios.post(url, {id});
    return data;
  } catch (error) {
    const message = (error as AxiosError)?.response?.data as string;
    console.log("error", message)
  }
};
