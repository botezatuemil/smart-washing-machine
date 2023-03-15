import {YStack, Text} from "tamagui"
import WashCard from "../../components/WashCard";

const Home = () => {
  
    return (
      <YStack alignItems="center" bg="white" h="100%" paddingTop={20} justifyContent="center" paddingHorizontal={24} >
        <WashCard type="washing machine" title="Washing Machine" imagePath={require("../../assets/images/washingMachineCartoon.png")}/>
        <WashCard type="tumble dryer" title="Tumble Dryer" imagePath={require("../../assets/images/dryerCartoon.png")}/>
      </YStack>
    );
  };

  export default Home;