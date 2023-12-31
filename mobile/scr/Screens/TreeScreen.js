import FamilyTree from "../component/FamilyTree";
import React, { Fragment, useState, useEffect } from "react";
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
} from "react-native";
import { axiosInstance } from "../constants/Axios";

export default function App({ navigation, route }) {
    const { s_id, name } = route.params;
    const [data, setData] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(
                    `/family/getftree/${s_id}`
                );
                setData(response.data.familyTree);
                setDataFetched(true);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm:", error);
            }
        };
        if (!dataFetched) {
            fetchData();
        }
    });

    const handleDataFetch = () => {
        setDataFetched(false);
    };
    console.disableYellowBox = true;
    return (
        <Fragment>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{marginBottom: 50}}>
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <FamilyTree
                        title={name}
                        pathColor="black"
                        siblingGap={10}
                        data={data}
                        updateTree={handleDataFetch}
                        navigation={navigation}
                        nodeStyle={{
                            width: 100,
                            height: 160,
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 2,
                            borderColor: "black",
                            borderRadius: 10,
                        }}
                        nodeImageStyle={{
                            width: 80,
                            height: 80,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        nodeTitleStyle={{
                            fontSize: 13,
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                        nodeInfoStyle={{
                            fontSize: 10,
                            textAlign: "center",
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
                        familyGap={10}
                        strokeWidth={2}
                        titleColor="green"
                    />
                </ScrollView>
            </SafeAreaView>
        </Fragment>
    );
}
