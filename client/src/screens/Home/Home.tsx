import { useEffect } from "react";
import { YStack, Text } from "tamagui";
import WashCard from "../../components/WashCard";
import { useUserStore } from "../../store/UserStore";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLoginStore } from "../../store/LoginStore";

const Home = () => {
  const { setFirstName, setId, setLastName } = useUserStore();
  const {setToken} = useLoginStore()

  const getAuthToken = async() => {
    try {
      const token: string | null = await AsyncStorage.getItem("token");

      if (token) {
        const decodedToken: {
          user_id: number;
          first_name: string;
          last_name: string;
        } = jwt_decode(token);
        setToken(token);
        setFirstName(decodedToken.first_name);
        setId(decodedToken.user_id);
        setLastName(decodedToken.last_name);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAuthToken();
  }, []);

  return (
    <YStack
      alignItems="center"
      bg="white"
      h="100%"
      paddingTop={20}
      justifyContent="center"
      paddingHorizontal={24}
    >
      <WashCard
        type="washing machine"
        title="Washing Machine"
        imagePath={require("../../assets/images/washingMachineCartoon.png")}
      />
      <WashCard
        type="tumble dryer"
        title="Tumble Dryer"
        imagePath={require("../../assets/images/dryerCartoon.png")}
      />
    </YStack>
  );
};

export default Home;
