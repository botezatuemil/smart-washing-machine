import { TouchableOpacity } from "react-native-gesture-handler";
import { YStack, Text, Image } from "tamagui";
import { WashingOption } from "../interfaces";
import {useNavigation} from  "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParams } from "../screens/Home/HomeNavigator";
import { RootStackParams } from "../navigation/TabNavigator";

const WashCard: React.FC<{ title: string; imagePath: string, type: WashingOption }> = (props) => {

  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParams>>();
 const tabNavigator = useNavigation<NativeStackNavigationProp<RootStackParams>>();
 
  
  return (
    <YStack
      marginVertical={20}
      alignItems="center"
      shadowColor="#b1a7a7"
      shadowOffset={{ width: 4, height: 4 }}
      shadowOpacity={1}
      elevation={5}
      backgroundColor="white"
      overflow="visible"
      zIndex={100}
      style={{
        elevation: 5,
      }}
      borderRadius={12}
      paddingTop={10}
      width="100%"
      onPress={() => {navigation.navigate("Laundry", {option: props.type}), tabNavigator.setOptions({navigationBarHidden : true})}}
    >
      <Text fontFamily="InterSemi" fontSize={18} color="#6d6e74">{props.title}</Text>
      <TouchableOpacity>
      <Image
        src={props.imagePath}
        height={250}
        width={250}
        resizeMode="contain"
      />
      </TouchableOpacity>
    </YStack>
  );
};

export default WashCard;
