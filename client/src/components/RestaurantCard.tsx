import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import {useNavigation} from  "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RestaurantStackParams } from "../navigation/TabNavigator";

const RestaurantCard: React.FC<{ name: string }> = (props) => {

  const navigation = useNavigation<NativeStackNavigationProp<RestaurantStackParams>>();

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate("Restaurant", {restaurantName: props.name})}>
      <Text>{props.name}</Text>
    </TouchableOpacity>
  );
};

export default RestaurantCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: 60,
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#6CF796",
    marginTop: 10,
    justifyContent: "center"
  },
});
