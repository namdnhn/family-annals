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
    Modal,
    Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
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
    const { s_id, updateTree } = route.params;
    const [data, setData] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(
                    `/member/get2/${s_id}`
                );
                setData(response.data.memberInfo);
                setDataFetched(true);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm:", error);
            }
        };
        if (!dataFetched) {
            fetchData();
        }
    });

    const ViewInfo = () => {
        return (
            <>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Image
                        source={{
                            uri:
                                data.images ||
                                "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
                        }}
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
                    <View style={{ flexDirection: "row" }}>
                        <View
                            style={{ flexDirection: "column", marginLeft: 5 }}
                        >
                            <Text style={styles.text}>{"\n"}Ngày sinh</Text>
                            <Text style={styles.text}>{"\n"}Nơi sinh</Text>
                            {data.date_of_death && (
                                <Text style={styles.text}>
                                    {"\n"}
                                    Mất ngày:
                                </Text>
                            )}
                            {data.place_of_death && (
                                <Text style={styles.text}>
                                    {"\n"}
                                    Mất tại:
                                </Text>
                            )}
                        </View>
                        <View
                            style={{ flexDirection: "column", marginLeft: 45 }}
                        >
                            <Text style={styles.text}>
                                {"\n"}
                                {data.date_of_birth
                                    ? new Date(
                                          data.date_of_birth
                                      ).toLocaleDateString("en-GB")
                                    : "Chưa biết"}
                            </Text>
                            <Text style={styles.text}>
                                {"\n"}
                                {data.place_of_birth
                                    ? data.place_of_birth
                                    : "Chưa biết"}
                            </Text>
                            {data.date_of_death && (
                                <Text style={styles.text}>
                                    {"\n"}
                                    {new Date(
                                        data.date_of_death
                                    ).toLocaleDateString("en-GB")}
                                </Text>
                            )}
                            {data.place_of_death && (
                                <Text style={styles.text}>
                                    {"\n"}
                                    {data.place_of_death}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 20,
                            paddingLeft: 25,
                            alignSelf: "flex-start",
                        }}
                    >
                        <Text style={styles.text}>
                            Tiểu sử:{" "}
                            {data.description ? data.description : "Chưa có"}
                        </Text>
                    </View>
                </View>
            </>
        );
    };
    const EditInfo = () => {
        const [fullname, setFullname] = useState("");
        const [Bday, setBday] = useState(new Date());
        const [Dday, setDday] = useState(new Date());
        const [toggleCheckBox, setToggleCheckBox] = useState(false);
        const [BPlace, setBPlace] = useState("");
        const [DPlace, setDPlace] = useState("");
        const [description, setDescription] = useState("");

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

        useEffect(() => {
            setFullname(data.fullname);
            setBday(new Date(data.date_of_birth));
            setDday(new Date(data.date_of_death));
            setBPlace(data.place_of_birth);
            setDPlace(data.place_of_death);
            setDescription(data.description);
            if (data.date_of_death) {
                setToggleCheckBox(true);
            }
        }, []);

        const submitForm = async () => {
            if (!toggleCheckBox) {
                setDday("");
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
                console.log(dataToUpdate);
                const response = await axiosInstance.put(
                    `/memberdetail/edit/${s_id}`,
                    dataToUpdate
                );
                console.log(response.data.message);
                console.log(response.data.memberDetail);
                Alert.alert("Thành công", "Dữ liệu đã được cập nhật!");
                setDataFetched(false);
            } catch (error) {
                console.error("Lỗi update thông tin:", error);
            }
        };
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
                            source={{
                                uri:
                                    data.images ||
                                    "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
                            }}
                            style={styles.img}
                        />
                        <Text style={styles.textchange}>Change Photo</Text>
                    </View>
                    <ScrollView
                        style={{
                            marginLeft: WIDTH / 15,
                            marginRight: WIDTH / 15,
                        }}
                    >
                        <View style={{ padding: 5 }}>
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
                        <View style={{ padding: 5 }}>
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
                                    <Text>
                                        {Bday.toLocaleDateString("en-GB")}
                                    </Text>
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
                        <View style={{ padding: 5 }}>
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
                                padding: 5,
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
                                <View style={{ padding: 5 }}>
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
                                                {Dday.toLocaleDateString(
                                                    "en-GB"
                                                )}
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
                                <View style={{ padding: 5 }}>
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

                        <View style={{ padding: 5 }}>
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
                                defaultValue={data.background_desc}
                                style={styles.Info}
                                onChangeText={(text) => setDescription(text)}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    };
    const EditRelationship = () => {
        const [spouse, setSpouse] = useState([]);
        const [parent, setParent] = useState({
            id: "",
            name: "",
        });
        const [children, setChildren] = useState([]);

        const [isChildModalVisible, setChildModalVisible] = useState(false);
        const [isFatherModalVisible, setFatherModalVisible] = useState(false);
        const [isSpouseModalVisible, setSpouseModalVisible] = useState(false);

        const [childName, setChildName] = useState("");
        const [gender, setGender] = useState("Nam");

        const [fatherName, setFatherName] = useState("");
        const [spouseName, setSpouseName] = useState("");

        useEffect(() => {
            setChildren(data.children);
            setSpouse(data.spouse);
            if (data.parent && data.parent[0]) {
                setParent({
                    id: data.parent[0].id,
                    name: data.parent[0].fullname,
                });
            }
        }, []);

        const toggleModal = () => {
            setChildModalVisible(!isChildModalVisible);
        };

        const addChild = async () => {
            const childData = {
                id: s_id,
                children_data: {
                    fullname: childName,
                    gender: gender,
                },
                family_id: data.family_id,
            };
            try {
                const response = await axiosInstance.post(
                    "/member/addchildren",
                    childData
                );
                if (response.status === 201) {
                    setDataFetched(false);
                    setChildName("");
                    setGender("Nam");
                    updateTree();
                }
            } catch (error) {
                console.error("Lỗi", error);
            }
        };

        const addFather = async () => {
            // Call API to add father
            // ...
            toggleModal();
        };

        const addSpouse = async () => {
            // Call API to add spouse
            // ...
            toggleModal();
        };

        return (
            <View style={{ backgroundColor: "#FFFFFF" }}>
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isChildModalVisible}
                        onRequestClose={() => {
                            setChildModalVisible(!isChildModalVisible);
                            setFatherModalVisible(false);
                            setSpouseModalVisible(false);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalTitle}>
                                    Thêm con mới
                                </Text>
                                <Text style={styles.modalText}>
                                    Chọn giới tính
                                </Text>
                                <Picker
                                    style={styles.pickerStyle}
                                    selectedValue={gender}
                                    onValueChange={(value, index) =>
                                        setGender(value)
                                    }
                                >
                                    <Picker.Item label="Nam" value="Nam" />
                                    <Picker.Item label="Nữ" value="Nữ" />
                                </Picker>

                                <Text style={styles.modalText}>Nhập tên:</Text>

                                <TextInput
                                    style={{
                                        marginTop: 5,
                                        fontSize: 16,
                                        borderBottomWidth: 1,
                                        borderColor: "black",
                                        color: "black",
                                        width: 200,
                                    }}
                                    onChangeText={(text) => setChildName(text)}
                                    value={childName}
                                />
                                <View
                                    style={{
                                        flexDirection: "row",
                                        paddingHorizontal: 10,
                                        marginTop: 10,
                                    }}
                                >
                                    <Button
                                        title="Add"
                                        color={"green"}
                                        onPress={addChild}
                                    />
                                    <View style={{ width: 10 }}></View>
                                    <Button
                                        onPress={() =>
                                            setChildModalVisible(
                                                !isChildModalVisible
                                            )
                                        }
                                        color={"green"}
                                        title="Trở lại"
                                    ></Button>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isFatherModalVisible}
                        onRequestClose={() => {
                            setChildModalVisible(false);
                            setFatherModalVisible(false);
                            setSpouseModalVisible(false);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalTitle}>
                                    Thêm thông tin cha
                                </Text>

                                <Text style={styles.modalText}>Nhập tên:</Text>

                                <TextInput
                                    style={{
                                        marginTop: 5,
                                        fontSize: 16,
                                        borderBottomWidth: 1,
                                        borderColor: "black",
                                        color: "black",
                                        width: 200,
                                    }}
                                    onChangeText={(text) => setFatherName(text)}
                                    value={fatherName}
                                />
                                <View
                                    style={{
                                        flexDirection: "row",
                                        paddingHorizontal: 10,
                                        marginTop: 10,
                                    }}
                                >
                                    <Button
                                        title="Add"
                                        color={"green"}
                                        onPress={addFather}
                                    />
                                    <View style={{ width: 10 }}></View>
                                    <Button
                                        onPress={() =>
                                            setFatherModalVisible(
                                                !isFatherModalVisible
                                            )
                                        }
                                        color={"green"}
                                        title="Trở lại"
                                    ></Button>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isSpouseModalVisible}
                        onRequestClose={() => {
                            setChildModalVisible(false);
                            setFatherModalVisible(false);
                            setSpouseModalVisible(false);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalTitle}>Thêm vợ</Text>

                                <Text style={styles.modalText}>Nhập tên:</Text>

                                <TextInput
                                    style={{
                                        marginTop: 5,
                                        fontSize: 16,
                                        borderBottomWidth: 1,
                                        borderColor: "black",
                                        color: "black",
                                        width: 200,
                                    }}
                                    onChangeText={(text) => setSpouseName(text)}
                                    value={spouseName}
                                />
                                <View
                                    style={{
                                        flexDirection: "row",
                                        paddingHorizontal: 10,
                                        marginTop: 10,
                                    }}
                                >
                                    <Button
                                        title="Add"
                                        color={"green"}
                                        onPress={addSpouse}
                                    />
                                    <View style={{ width: 10 }}></View>
                                    <Button
                                        onPress={() =>
                                            setSpouseModalVisible(
                                                !isSpouseModalVisible
                                            )
                                        }
                                        color={"green"}
                                        title="Trở lại"
                                    ></Button>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View
                    height={ScreenHeight}
                    style={{ backgroundColor: "#FFFFFF" }}
                >
                    <View
                        style={{
                            height: 160,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <View>
                            <Image
                                source={{
                                    uri:
                                        data.images ||
                                        "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
                                }}
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 50,
                                    marginTop: 30,
                                    marginLeft: 30,
                                }}
                            />
                        </View>

                        <View
                            style={{
                                flexDirection: "column",
                                justifyContent: "center",
                                marginRight: 30,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 24,
                                    fontWeight: "bold",
                                    marginVertical: 5,
                                }}
                            >
                                {data.fullname}
                            </Text>
                        </View>
                    </View>

                    <ScrollView
                        style={{
                            marginLeft: 30,
                            marginTop: 30,
                            marginRight: 30,
                        }}
                    >
                        {data.gender === "Nam" && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Text style={styles.textheader}> Vợ </Text>
                                <Button
                                    title="Thêm"
                                    color={"green"}
                                    onPress={() => {
                                        setChildModalVisible(false);
                                        setFatherModalVisible(false);
                                        setSpouseModalVisible(true);
                                    }}
                                ></Button>
                            </View>
                        )}
                        <ScrollView>
                            {spouse &&
                                spouse.map((val) => {
                                    return (
                                        <View
                                            key={val.id}
                                            style={styles.songsWrapper}
                                        >
                                            <TouchableOpacity
                                                style={styles.songs}
                                                onPress={() =>
                                                    navigation.push(
                                                        "DetailMember",
                                                        { s_id: val.id }
                                                    )
                                                }
                                            >
                                                <View>
                                                    <Text
                                                        style={styles.songTitle}
                                                    >
                                                        {val.fullname}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                        </ScrollView>
                        <View
                            style={{
                                marginTop: 5,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text style={styles.textheader}> Bố </Text>

                            {!parent.id && (
                                <Button
                                    title="Thêm"
                                    color={"green"}
                                    onPress={() => {
                                        setChildModalVisible(false);
                                        setFatherModalVisible(true);
                                        setSpouseModalVisible(false);
                                    }}
                                ></Button>
                            )}
                        </View>

                        <View>
                            {parent.id ? (
                                <View style={styles.songsWrapper}>
                                    <TouchableOpacity
                                        style={styles.songs}
                                        onPress={() =>
                                            navigation.push("DetailMember", {
                                                s_id: parent.id,
                                            })
                                        }
                                    >
                                        <View>
                                            <Text style={styles.songTitle}>
                                                {parent.name}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Text style={styles.songTitle}>
                                    No information
                                </Text>
                            )}
                        </View>

                        <View
                            style={{
                                marginTop: 5,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text style={styles.textheader}> Con </Text>
                            <Button
                                title="Thêm"
                                color={"green"}
                                onPress={() => {
                                    setChildModalVisible(true);
                                    setFatherModalVisible(false);
                                    setSpouseModalVisible(false);
                                }}
                            ></Button>
                        </View>
                        <ScrollView>
                            {children &&
                                children.map((val) => {
                                    return (
                                        <View
                                            key={val.id}
                                            style={styles.songsWrapper}
                                        >
                                            <TouchableOpacity
                                                style={styles.songs}
                                                onPress={() =>
                                                    navigation.push(
                                                        "DetailMember",
                                                        { s_id: val.id }
                                                    )
                                                }
                                            >
                                                <View>
                                                    <Text
                                                        style={styles.songTitle}
                                                    >
                                                        {val.fullname}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                        </ScrollView>
                    </ScrollView>
                </View>
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
        fontSize: 19,
        fontWeight: "bold",
        color: "black",
    },
    pickerStyle: {
        width: 200,
        color: "#344953",
        justifyContent: "center",
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
    songs: {
        height: (50 / standardHeight) * HEIGHT,
        flexDirection: "row",
        width: WIDTH - 40,
    },
    songsWrapper: {
        marginTop: 5,
        backgroundColor: "white",
        flexDirection: "row",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 15,
    },
    songTitle: {
        marginTop: 12,
        fontSize: 18,
        color: "black",
        marginLeft: 10,
    },
    songType: {
        marginTop: 0,
        color: "#616161",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
};
