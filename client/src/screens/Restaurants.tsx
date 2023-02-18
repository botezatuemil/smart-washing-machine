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
import supabase from "../config/supabaseClient";
import { RestaurantDb, DetailDb, RestaurantDetail } from "../index";
const RestaurantStack = createNativeStackNavigator<RestaurantStackParams>();

export const RestaurantsScreenStack = () => {
  return (
    <RestaurantStack.Navigator initialRouteName="Restaurants">
      <RestaurantStack.Screen name="Restaurant" component={Restaurant} />
      <RestaurantStack.Screen name="Restaurants" component={Restaurants} />
    </RestaurantStack.Navigator>
  );
};



const Restaurants = () => {
  const [restaurantsData, setRestaurantsData] = useState<RestaurantDetail[]>([]);

  const navigation = useNavigation();

  function isRestaurantDetail(object : unknown): object is RestaurantDetail[] {
    if (object !== null && typeof object === "object") {
      return true;
    }
    return false;
  }

  const getData = async() => {
    const result : unknown = await (await supabase.from('Restaurant').select(`name, id, Detail (\*)`)).data;
    if (isRestaurantDetail(result)) {
      return result;
    }
    return null;
    //return result.data as RestaurantDetail[]
  }

  const fetchRestaurants = async () => {
    const data = await getData();
    if (data !== null)
    setRestaurantsData(data);
    
  };
  useEffect(() => {
    fetchRestaurants();
  });

  return (
    <View style={styles.container}>
      <Text>Restaurant Page</Text>

      <View style={{ width: "100%", height: "50%" }}>
        <ScrollView style={{ padding: 10, width: "100%" }}>
          {restaurantsData?.map(resturant => <RestaurantCard name={resturant.name} />)}
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={() => {
          return navigation.openDrawer();
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
