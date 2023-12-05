import * as React from "react";
import { useState } from "react";

import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  ImageBackground,
  Touchable,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  VirtualizedList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input } from "react-native-elements";


const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");
const standardWidth = 360;
const standardHeight = 800;

export default function SearchScreen({ navigation }) {

  return (
    <View style={styles.background}>
      <View style={{ flexDirection: 'row', marginTop: 50 }}>
        <View style = {{width: WIDTH - 60}}>
          <Input
            placeholder="Bạn muốn tìm gì..."
            leftIcon={{
              type: "search-outline",
              name: "search",
              color: "black"
            }}
            rightIcon={{
              type: "backspace",
              name: "backspace",
              color: "black",

            }}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            leftIconContainerStyle={styles.leftIconStyle}
            rightIconContainerStyle={styles.rightIconStyle}
            placeholderTextColor={"gray"}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style = {{marginTop:10}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
    flex: 1,
    width: null,
    height: null,
  },
  buttonText: {
    width: WIDTH - 100,
    height: (40 / standardHeight) * HEIGHT,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    fontSize: 16,
    paddingLeft: (45 / standardWidth) * WIDTH,
    backgroundColor: "black",
    color: "black",
    marginHorizontal: 20,
  },
  cancelButton: {
    color: "black",
    fontSize: 15,
  },
  note: {
    alignSelf: "flex-start",
    color: "white",
  },
  scrollView: {
    height: (70 / standardHeight) * HEIGHT,
  },
  scrollContainer: {
    backgroundColor: "#242424",
    height: (40 / standardHeight) * HEIGHT,
    alignSelf: "flex-start",
    // marginTop: 20,
    borderRadius: 20,
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    overflow: "hidden",
  },
  selectedCategory: {
    backgroundColor: "rgba(221,114,158,1)",
    color: "black",
  },
  songsContainer: {
    flex: 1,
    width: WIDTH,
    backgroundColor: "#151515",
  },
  songsWrapper: {
    flexDirection: "row",
  },
  songs: {
    height: (70 / standardHeight) * HEIGHT,
    flexDirection: "row",
    width: WIDTH - 40,
  },
  songOption: {
    color: "#616161",
    fontSize: 30,
    marginTop: 20,
  },
  typeOption: {
    color: "#616161",
    fontSize: 30,
    marginTop: 35,
  },
  songImage: {
    height: (50 / standardHeight) * HEIGHT,
    width: (50 / standardWidth) * WIDTH,
    margin: 20,
  },
  songTitle: {
    marginTop: 25,
    fontSize: 18,
    color: "white",
  },
  songType: {
    marginTop: 0,
    color: "#616161",
  },
  img: {
    width: (WIDTH - 60) / 2,
    height: (WIDTH - 60) / 2,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 10,
  },

  inputContainer: {
    width: 100
  },

  inputContainerStyle: {
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    height: 40,
  },

  inputStyle: {
    paddingLeft: 10,
  },

  leftIconStyle: {
    paddingLeft: 15,
  },
  rightIconStyle: {
    paddingRight: 15,
  }
});
