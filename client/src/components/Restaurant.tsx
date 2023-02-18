import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import {Text, View} from  "react-native";
import { RestaurantStackParams } from "../navigation/TabNavigator";
type Props = NativeStackScreenProps<RestaurantStackParams, "Restaurant">;

const Restaurant = ({route} : Props) => {
  return (
    <View style={{width: "100%", height: "100%"}}>
        <Text>{route.params?.restaurantName}</Text>
    </View>
  );
};

export default Restaurant;
