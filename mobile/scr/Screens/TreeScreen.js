import FamilyTree from "../component/FamilyTree";
import React, { Fragment } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from "react-native";

export default function App({ navigation }) {
  console.disableYellowBox = true;
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <FamilyTree
            title="Rethinam and Family"
            pathColor="black"
            siblingGap={10}
            navigation={navigation}
            nodeStyle={{
              width: 100,
              height: 145,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
              borderColor: "black",
              borderRadius: 10
            }}
            nodeImageStyle={{
              width: 80,
              height: 80,
              justifyContent: "center",
              alignItems: "center",
            }}
            nodeTitleStyle={{
              fontSize: 14,
              fontWeight: "bold",
              textAlign: "center"
            }}
            nodeInfoStyle={{
              fontSize: 13,
              textAlign: "center"
            }}
            imageStyle={{
              width: "100%",
              height: "100%",
              borderRadius: 50,
              resizeMode: "cover",
            }}
            textStyle={{
              marginTop: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            nodeInfoColor="grey"
            nodeTitleColor="red"
            familyGap={5}
            strokeWidth={2}
            titleColor="green"
          />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
}
