import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';


import 'react-native-gesture-handler';
import DrawerNavigation from './src/navigation/DrawerNavigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator<RootStackParams>();

export type RootStackParams = {
  Drawer: any;
}

export default function App() {
  return (
   <NavigationContainer>
    <RootStack.Navigator initialRouteName='Drawer'
    screenOptions={{headerShown: false}}
     >
      <RootStack.Screen name="Drawer" component={DrawerNavigation}/>
    </RootStack.Navigator>
   </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: "100%",
    
  },
});
