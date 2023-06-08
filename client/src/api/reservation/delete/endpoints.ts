import { IP, PORT } from "@env";
import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";
import { LogBox } from "react-native";
const url = `http://${IP}:${PORT}/deleteReservation`;

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export type RequestReservationDelete = {
  reservationId: React.Key;
  token: string;
};
export const deleteReservation = async (request: RequestReservationDelete) => {
  try {
    const { data } = await axios.post(
      url,
      {
        reservationId: request.reservationId,
      },
      {
        headers: {
          "x-access-token": request.token,
        },
      }
    );
    console.log(data);
    return data;
  } catch (error) {
    const message = (error as AxiosError)?.response?.data as string;
    console.log(message);
    throw new Error(message);
  }
};