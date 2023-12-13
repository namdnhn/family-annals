import React, { useContext } from "react";
import TokenContext from "../contexts/TokenContext";
import { View } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../Screens/HomeScreen";
import TreeScreen from "../Screens/TreeScreen";
import DetailMember from "../Screens/DetailMember";

const Stack = createNativeStackNavigator();

export default function PlayerScreenTab() {

  return (
    <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}} />
        <Stack.Screen name="TreeScreen" component={TreeScreen} options={{headerShown: false}} />
        <Stack.Screen name="DetailMember" component={DetailMember} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}
