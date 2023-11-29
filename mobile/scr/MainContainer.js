import * as React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import UserScreenTab from "./Tabs/UserScreenTab";
import PlayerScreenTab from "./Tabs/PlayerScreenTab";
import SearchScreenTab from "./Tabs/SearchScreenTab";

const homeName = "Home";
const UserName = "UserTab";
const SearchName = "SearchTab";

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            paddingHorizontal: 5,
            paddingTop: 0,
            backgroundColor: "rgba(34,36,40,1)",
            position: "absolute",
            borderTopWidth: 0,
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;
            if (rn === homeName) {
              iconName = focused ? "home" : "home-outline";
            } else if (rn === UserName) {
              iconName = focused ? "person" : "person-outline";
            } else if (rn === SearchName) {
              iconName = focused ? "search" : "search-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarLabelStyle: { display: "none" },
          tabBarActiveTintColor: "rgba(221,114,158,1)",
          tabBarInactiveTintColor: "gray",
          tabBarHideOnKeyboard: true,
        })}
      >
        <Tab.Screen
          name={homeName}
          component={PlayerScreenTab}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name={SearchName}
          component={SearchScreenTab}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name={UserName}
          component={UserScreenTab}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
