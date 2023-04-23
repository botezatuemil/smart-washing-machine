import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";
import { QRRequestType } from "./authQR.const";
import { sendQR } from "./endpoints";

export const useQR = (
  onSuccess: (data: string) => void,
  onError?: (error: unknown) => void
) => {
  return useMutation(
    "qr",
    async (input: QRRequestType) => await sendQR(input),
    {
      onSuccess,
      onError: () => console.log("Failed authorizing"),
    }
  );
};
