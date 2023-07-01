import { useMutation } from "react-query";
import { LoginRequestType } from "../../screens/Auth/Auth.const";
import { login } from "./endpoints";

export const useLogin = (
  onSuccess: (data: string) => void,
  onError: (error: unknown) => void
) => {
  return useMutation(
    "login",
    async (input: LoginRequestType) => await login(input),
    {
      onSuccess,
      onError,
    }
  );
};
