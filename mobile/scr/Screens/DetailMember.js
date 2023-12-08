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
import { Platform, Button, SafeAreaView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeight } from "react-native-elements/dist/helpers";
import { axiosInstance } from "../constants/Axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import CheckBox from "expo-checkbox";

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
    const [fullname, setFullname] = useState("");
    const [realBday, setRealBday] = useState(new Date());
    const [realDday, setRealDday] = useState(new Date());
    const [Bday, setBday] = useState(new Date());
    const [Dday, setDday] = useState(new Date());
    const [BPlace, setBPlace] = useState("");
    const [DPlace, setDPlace] = useState("");
    const [description, setDescription] = useState("");
    const [toggleCheckBox, setToggleCheckBox] = useState(false);

    const [mode1, setMode1] = useState("date");
    const [mode2, setMode2] = useState("date");
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);

    const onChange1 = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow1(false);
        setBday(currentDate);
    };

    const onChange2 = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow2(false);
        setDday(currentDate);
    };

    const showMode1 = (currentMode) => {
        setShow1(true);
        setMode1(currentMode);
    };

    const showMode2 = (currentMode) => {
        setShow2(true);
        setMode2(currentMode);
    };

    const showDatepicker1 = () => {
        showMode1("date");
    };

    const showDatepicker2 = () => {
        showMode2("date");
    };

    const submitForm = async () => {
        // setRealBday(Bday);
        // setRealDday(Dday);

        if (!toggleCheckBox) {
            setRealDday("");
            setDPlace("");
        }

        const dataToUpdate = {
            fullname: fullname,
            gender: data.gender,
            date_of_birth: Bday,
            place_of_birth: BPlace,
            date_of_death: Dday,
            place_of_death: DPlace,
            images: data.images,
            background_desc: description,
        };

        try {
            const response = await axiosInstance.put(
                `/memberdetail/edit/${s_id}`,
                dataToUpdate
            );
            Alert.alert("Thành công", "Dữ liệu đã được cập nhật!");
            setDataFetched(false);
        } catch (error) {
            console.error("Lỗi update thông tin:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(
                    `/memberdetail/get2/${s_id}`
                );
                setData(response.data.memberDetail);
                console.log(data);
                var date_of_birth = "";
                if (response.data.memberDetail.date_of_birth) {
                    date_of_birth = new Date(
                        response.data.memberDetail.date_of_birth
                    );
                    setRealBday(date_of_birth);
                    setBday(date_of_birth);
                }

                var date_of_dead = "";
                if (response.data.memberDetail.date_of_death) {
                    setToggleCheckBox(true);
                    date_of_dead = new Date(
                        response.data.memberDetail.date_of_death
                    );
                    setRealDday(date_of_dead);
                    setDday(date_of_dead);
                }
                setFullname(data.fullname);
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
        }
    });

    const ViewInfo = () => {
        return (
            <>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Image
                        source={{ uri: data.images }}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            marginTop: 50,
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            marginVertical: 10,
                        }}
                    >
                        {data.fullname}
                    </Text>
                    <Text style={styles.text}>
                        Sinh ngày:{" "}
                        {data.date_of_birth
                            ? realBday.toLocaleDateString("en-GB")
                            : "Chưa biết"}
                    </Text>
                    <Text style={styles.text}>
                        Nơi sinh:{" "}
                        {data.place_of_birth
                            ? data.place_of_birth
                            : "Chưa biết"}
                    </Text>
                    {data.date_of_death && (
                        <Text style={styles.text}>
                            Mất ngày: {realDday.toLocaleDateString("en-GB")}
                        </Text>
                    )}
                    {data.place_of_death && (
                        <Text style={styles.text}>
                            Mất tại: {data.place_of_death}
                        </Text>
                    )}
                </View>
                <View style={{ flex: 1.25, paddingLeft: 20 }}>
                    <Text style={styles.text}>
                        Tiểu sử:{" "}
                        {data.background_desc
                            ? data.background_desc
                            : "Chưa có"}
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
            <View style={{ backgroundColor: "#FFFFFF" }}>
                <View
                    height={ScreenHeight}
                    style={{ backgroundColor: "#FFFFFF" }}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={submitForm}>
                            <Ionicons
                                name="checkmark"
                                style={{ fontSize: 35, color: "black" }}
                            ></Ionicons>
                        </TouchableOpacity>
                    </View>
                    <View style={{ padding: 20, alignItems: "center" }}>
                        <Image
                            source={{ uri: data.images }}
                            style={styles.img}
                        />
                        <Text style={styles.textchange}>Change Photo</Text>
                    </View>
                    <View
                        style={{
                            marginLeft: WIDTH / 15,
                            marginRight: WIDTH / 15,
                        }}
                    >
                        <View style={{ padding: 10 }}>
                            <Text
                                style={{
                                    opacity: 0.5,
                                    fontSize: 18,
                                    color: "black",
                                }}
                            >
                                Tên
                            </Text>
                            <TextInput
                                placeholder="VD: Nguyễn Văn A"
                                value={fullname}
                                style={styles.Info}
                                onChangeText={(text) => setFullname(text)}
                            />
                        </View>
                        <View style={{ padding: 10 }}>
                            <Text
                                style={{
                                    opacity: 0.5,
                                    fontSize: 18,
                                    color: "black",
                                }}
                            >
                                Sinh ngày
                            </Text>
                            <SafeAreaView>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text>{Bday.toLocaleDateString()}</Text>
                                    <Button
                                        style={styles.button}
                                        onPress={showDatepicker1}
                                        title="Chọn ngày sinh"
                                        color={"green"}
                                    />
                                </View>

                                {show1 && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={Bday}
                                        mode={mode1}
                                        onChange={onChange1}
                                    />
                                )}
                            </SafeAreaView>
                        </View>
                        <View style={{ padding: 10 }}>
                            <Text
                                style={{
                                    opacity: 0.5,
                                    fontSize: 18,
                                    color: "black",
                                }}
                            >
                                Nơi sinh
                            </Text>
                            <TextInput
                                placeholder="Nơi sinh"
                                defaultValue={data.place_of_birth}
                                style={styles.Info}
                                value={BPlace}
                                onChangeText={(text) => setBPlace(text)}
                            />
                        </View>
                        <View
                            style={{
                                padding: 10,
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <CheckBox
                                disabled={false}
                                value={toggleCheckBox}
                                onValueChange={() =>
                                    setToggleCheckBox(!toggleCheckBox)
                                }
                            />
                            <Text
                                style={{
                                    opacity: 0.5,
                                    fontSize: 18,
                                    color: "black",
                                }}
                            >
                                {"   "}
                                Đã mất
                            </Text>
                        </View>

                        {toggleCheckBox && (
                            <>
                                <View style={{ padding: 10 }}>
                                    <Text
                                        style={{
                                            opacity: 0.5,
                                            fontSize: 18,
                                            color: "black",
                                        }}
                                    >
                                        Mất ngày
                                    </Text>
                                    <SafeAreaView>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text>
                                                {Dday.toLocaleDateString()}
                                            </Text>
                                            <Button
                                                style={styles.button}
                                                onPress={showDatepicker2}
                                                title="Chọn ngày mất"
                                                color={"green"}
                                            />
                                        </View>

                                        {show2 && (
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={Dday}
                                                mode={mode2}
                                                onChange={onChange2}
                                            />
                                        )}
                                    </SafeAreaView>
                                </View>
                                <View style={{ padding: 10 }}>
                                    <Text
                                        style={{
                                            opacity: 0.5,
                                            fontSize: 18,
                                            color: "black",
                                        }}
                                    >
                                        Mất tại
                                    </Text>
                                    <TextInput
                                        placeholder="Nơi mất"
                                        defaultValue={data.place_of_birth}
                                        value={DPlace}
                                        style={styles.Info}
                                        onChangeText={(text) => setDPlace(text)}
                                    />
                                </View>
                            </>
                        )}

                        <View style={{ padding: 10 }}>
                            <Text
                                style={{
                                    opacity: 0.5,
                                    fontSize: 18,
                                    color: "black",
                                }}
                            >
                                Tiểu sử
                            </Text>
                            <TextInput
                                placeholder="Tiểu sử"
                                multiline={true}
                                value={description}
                                defaultValue={data.place_of_birth}
                                style={styles.Info}
                                onChangeText={(text) => setDescription(text)}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    };
    const EditRelationship = () => {
        return (
            <View style={{ backgroundColor: "#FFFFFF" }}>
                <View
                    height={ScreenHeight}
                    style={{ backgroundColor: "#FFFFFF" }}
                ></View>
            </View>
        );
    };
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: "green", // Màu chữ của tab đang được chọn
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
    headcontainer: {
        width: "100%",
        height: "100%",
        backgroundColor: "black",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 9,
    },
    textheader: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
    img: {
        width: 80,
        height: 80,
        borderRadius: 100,
    },
    textchange: {
        color: "#3493D9",
    },
    Info: {
        marginTop: 5,
        fontSize: 16,
        borderBottomWidth: 1,
        borderColor: "black",
        color: "black",
    },
    button: {
        backgroundColor: "green",
    },
};
