import {YStack, Text} from "tamagui"
import WashCard from "../../components/WashCard";

const Explore = () => {
  
    return (
      <YStack alignItems="center" bg="white" h="100%" paddingTop={20} justifyContent="center" paddingHorizontal={24} >
        <WashCard title="Washing Machine" imagePath={require("../../assets/images/washingMachineCartoon.png")}/>
        <WashCard title="Tumble Dryer" imagePath={require("../../assets/images/dryerCartoon.png")}/>
      </YStack>
    );
  };

  export default Explore;