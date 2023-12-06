import * as React from "react";
import { useState, useEffect } from "react";
import { Dimensions, Image, TouchableOpacity } from "react-native";
import { View, Text, ScrollView, FlatList } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import logo from "../../assets/img/logo.png";
import { axiosInstance } from "../constants/Axios";

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState("");
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/family/getall");
        setData(response.data.families);
        setDataFetched(true);
        console.log(data);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      }
    };

    if (!dataFetched) {
      fetchData();
    }
    prepare();
  });

  SplashScreen.hideAsync();

  return (
    <>
      <View style={{ alignItems: "center", paddingTop: 50 }}>
        <Image
          source={logo}
          style={{
            width: (150 / 360) * WIDTH,
            height: (165 / 800) * HEIGHT,
          }}
        />
        <Text
          style={{
            fontSize: 30,
            color: "rgb(12, 74, 110)",
            fontWeight: "bold",
          }}
        >
          Family Annals
        </Text>
        <Text
          style={{
            fontSize: 20,
            color: "rgb(12, 74, 110)",
          }}
        >
          Khám phá gia phả dòng họ
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 30,
        }}
      >
        <View style={{ paddingTop: 20, paddingLeft: 20 }}>
          <Text
            style={{
              fontSize: 19,
              color: "black",
              fontWeight: "bold",
            }}
          >
            Chào bạn,
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "gray",
            }}
          >
            Hôm nay bạn thế nào?
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          width: WIDTH,
          backgroundColor: "white",
        }}
      >
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                style={{
                  height: (70 / 800) * HEIGHT,
                  flexDirection: "row",
                  width: WIDTH - 40,
                }}
                onPress={() => {
                  navigation.navigate("TreeScreen", { s_id: item._id });
                }}
              >
                <Image
                  source={{ uri: item.logo }}
                  style={{
                    height: 60,
                    width: 60,
                    margin: 20,
                  }}
                  resizeMode="cover"
                />
                <View>
                  <Text
                    style={{
                      marginTop: 25,
                      fontSize: 18,
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text style={{ marginTop: 0, color: "#616161" }}>
                    {item.members.length} thành viên
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        ></FlatList>
      </View>
    </>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "white",
    marginBottom: 45,
    //marginTop: 30,
  },
  img: {
    width: Dimensions.get("window").width / 3 - 13,
    height: Dimensions.get("window").height / 6 - 2,
    backgroundColor: "#1A0938",
    // borderRadius: 10,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 2,
    borderColor: "black",
    borderWidth: 1,
  },
  name: {
    width: Dimensions.get("window").width / 3 - 13,
    height: 46,
    paddingHorizontal: 2,
    paddingVertical: 2,
    alignSelf: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  },

  img2: {
    width: Dimensions.get("window").width / 3,
    height: Dimensions.get("window").height / 6 - 2,
    backgroundColor: "#1A0938",
    borderRadius: 20,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 2,
    borderColor: "black",
    borderWidth: 1,
  },
  name2: {
    width: Dimensions.get("window").width / 3 - 10,
    height: 46,
    paddingHorizontal: 2,
    paddingVertical: 2,
    alignSelf: "center",
    alignItems: "center",
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  },
  img3: {
    width: Dimensions.get("window").width / 3,
    height: Dimensions.get("window").height / 6 - 2,
    backgroundColor: "#1A0938",
    borderRadius: 10,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 2,
    borderColor: "black",
    borderWidth: 1,
  },
  name3: {
    width: Dimensions.get("window").width / 3 - 10,
    height: 46,
    paddingHorizontal: 2,
    paddingVertical: 2,
    alignSelf: "center",
    alignItems: "center",
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  },

  Rectangle: {
    width: Dimensions.get("window").width,
    height: 1,
    backgroundColor: "#AEB5BC",
    marginTop: 20,
    marginBottom: 20,
  },
  content: {
    flexWrap: "wrap",
    margin: 5,
    left: 5,
    borderRadius: 12,
    justifyContent: "center",
    // alignSelf: "center",
    alignItems: "center",
  },
  edit1: {
    marginLeft: 25,
    marginTop: 15,
    marginBottom: 15,
    height: 40,
    width: 80,
    backgroundColor: "green",
    borderWidth: 1,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  edit2: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
};
