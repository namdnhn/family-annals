import * as React from "react";
import { useState, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
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
import { Platform } from "react-native";
import { BackgroundImage } from "react-native-elements/dist/config";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeight } from "react-native-elements/dist/helpers";
import { axiosInstance } from "../constants/Axios";

const Tab = createMaterialTopTabNavigator();
const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");
const standardWidth = 360;
const standardHeight = 800;

export default function DetailMember({ navigation, route }) {
  const { s_id } = route.params;
  const [data, setData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [spouse, setSpouse] = useState("");
  const [children, setChildren] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/memberdetail/get/${s_id}`);
        setData(response.data.memberDetail);
        console.log(data);
        setDataFetched(true);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      }
    };
    if (!dataFetched) {
      fetchData();
    }

    if (data) {
        console.log(data.spouse);
    //   if (data.spouse.length === 1) setSpouse(data.spouse[0].fullname);
    //   else if (data.spouse.length > 1) {
    //     var s = data.spouse[0].fullname;
    //     for (var i = 1; i < data.spouse.length; i++)
    //       s += ", " + data.spouse[i].fullname;
    //     setSpouse(s);
    //     console.log(spouse);
    //   }
    }
  });

  const ViewInfo = () => {
    return (
      <>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Image
            source={{ uri: data.images }}
            style={{ width: 100, height: 100, borderRadius: 50, marginTop: 50 }}
          />
          <Text
            style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}
          >
            {data.fullname}
          </Text>
          <Text style={styles.text}>
            Sinh ngày: {data.date_of_birth ? data.date_of_birth : "Chưa biết"}
          </Text>
          <Text style={styles.text}>
            Nơi sinh: {data.place_of_birth ? data.place_of_birth : "Chưa biết"}
          </Text>
          {data.date_of_death && (
            <Text style={styles.text}>Mất ngày: {data.date_of_death}</Text>
          )}
          {data.place_of_death && (
            <Text style={styles.text}>Mất tại: {data.place_of_death}</Text>
          )}
        </View>
        <View style={{ flex: 1.25, paddingLeft: 20 }}>
          <Text style={styles.text}>
            Tiểu sử: {data.background_desc ? data.background_desc : "Chưa có"}
          </Text>
          <Text style={styles.text}>
            Vợ/chồng: {spouse ? spouse : "Chưa kết hôn"}
          </Text>
        </View>
      </>
    );
  };
  const EditInfo = () => {
    return (
      <View style={{ backgroundColor: "#000000" }}>
        <View
          height={ScreenHeight}
          style={{ backgroundColor: "#000000" }}
        ></View>
      </View>
    );
  };
  const EditRelationship = () => {
    return (
      <View style={{ backgroundColor: "#000000" }}>
        <View
          height={ScreenHeight}
          style={{ backgroundColor: "#000000" }}
        ></View>
      </View>
    );
  };
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white", // Màu chữ của tab đang được chọn
        tabBarInactiveTintColor: "gray", // Màu chữ của các tab không được chọn
        tabBarStyle: { backgroundColor: "black" }, // Màu nền của thanh bottom tab
        tabBarIndicatorStyle: {
          backgroundColor: "white", // Màu của thanh hoạt động
          height: 1.5,
        },
        tabBarLabelStyle: {
          fontWeight: "bold", // Chữ in đậm
          fontSize: 14, // Kích thước font chữ
        },
      }}
    >
      <Tab.Screen name="Thông Tin" component={ViewInfo} />
      <Tab.Screen name="Sửa Thông Tin" component={EditInfo} />
      <Tab.Screen name="Thêm Quan Hệ" component={EditRelationship} />
    </Tab.Navigator>
  );
}

const styles = {
  text: {
    fontSize: 19,
  },
};
