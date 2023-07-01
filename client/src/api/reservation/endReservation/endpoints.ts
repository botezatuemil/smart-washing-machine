import { IP, PORT } from "@env";
import axios, { AxiosError } from "axios";
import React from "react";
import { LogBox } from "react-native";
const url = `http://${IP}:${PORT}/endReservation`;

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export type EndReservation = {
  token: string;
  reservationId: React.Key;
};

export const endReservation = async (input: EndReservation) => {
  try {
    const { data } = await axios.post(
      url,
      { reservationId: input.reservationId },
      {
        headers: {
          "x-access-token": input.token,
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
