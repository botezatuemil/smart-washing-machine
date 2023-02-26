import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import RestaurantCard from "../components/RestaurantCard";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../helper/Metrics";
import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import {
  RestaurantStackParams,
} from "../navigation/TabNavigator";
import Restaurant from "../components/Restaurant";
import { RestaurantDb, DetailDb, RestaurantDetail } from "../index";
import { IStudent } from "../interfaces/student.interface";
const RestaurantStack = createNativeStackNavigator<RestaurantStackParams>();
import * as api from "../routes/routes"
import axios, { AxiosError } from "axios";

export const RestaurantsScreenStack = () => {
  return (
    <RestaurantStack.Navigator initialRouteName="Restaurants">
      <RestaurantStack.Screen name="Restaurant" component={Restaurant} />
      <RestaurantStack.Screen name="Restaurants" component={Restaurants} />
    </RestaurantStack.Navigator>
  );
};



const Restaurants = () => {
  const [students, setStudents] = useState<IStudent[]>([]);

  const navigation = useNavigation();

  const getData = async() => {
    try {
      const {data}  = await  api.getStudents();
      setStudents(data as IStudent[]);
      console.log(data)
    } catch (error) {
      const errorMsg = error as AxiosError;

      console.log(errorMsg.toJSON())
      // console.log(error)
    }
   
  }
 


  return (
    <View style={styles.container}>
      <Text>Restaurant Page</Text>

      <View style={{ width: "100%", height: "50%" }}>
        {/* <ScrollView style={{ padding: 10, width: "100%" }}>
          {students?.map(student => <RestaurantCard name={student.name} />)}
        </ScrollView> */}
      </View>
      <TouchableOpacity
        onPress={() => {
          // return navigation.openDrawer();
          getData()
        }}
        style={{
          backgroundColor: "black",
          top: 0,
          width: "50%",
          padding: 10,
          borderRadius: 6,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "20%",
    width: "100%",
    alignItems: "center",
    flexDirection: "column",
    height: "100%",
  },
});

export default Restaurants;
