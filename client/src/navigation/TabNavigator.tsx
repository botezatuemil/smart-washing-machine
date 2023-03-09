import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from "@react-navigation/drawer";
import 'react-native-gesture-handler';
import Explore from '../screens/Explore';
import Profile from '../screens/Profile/Profile';
import { RestaurantsScreenStack } from '../screens/Restaurants';

const RootStack = createBottomTabNavigator<RootStackParams>();
export type RootStackParams = {
  Explore:any;
  Profile:any;
  RestaurantsStack: any;
}

export type RestaurantStackParams = {
  Restaurants:any;
  Restaurant: {
    restaurantName : string
  };
}

export default function TabNavigator() {
  return (
  
    <RootStack.Navigator initialRouteName='Explore'
     >
      <RootStack.Screen name="Explore" component={Explore}/>
      <RootStack.Screen name="Profile" component={Profile}/>
      <RootStack.Screen name="RestaurantsStack" component={RestaurantsScreenStack}
        options={{headerShown: false}}
      />
    
    </RootStack.Navigator>
  
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: "100%",
    
  },
});
