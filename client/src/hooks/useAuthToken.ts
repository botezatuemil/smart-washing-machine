import { useUserStore } from "../store/UserStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { useLoginStore } from "../store/LoginStore";

const useAuthToken = () => {
  const { setFirstName, setId, setLastName, setExpoToken, id, expoToken } =
    useUserStore();
  const { setToken } = useLoginStore();
  const getAuthToken = async () => {
    try {
      const token: string | null = await AsyncStorage.getItem("token");

      if (token) {
        const decodedToken: {
          user_id: number;
          first_name: string;
          last_name: string;
          expo_token: string;
        } = jwt_decode(token);
        setToken(token);
        setFirstName(decodedToken.first_name);
        setId(decodedToken.user_id);
        setLastName(decodedToken.last_name);
        setExpoToken(decodedToken.expo_token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {id, expoToken, getAuthToken}
};

export default useAuthToken;
