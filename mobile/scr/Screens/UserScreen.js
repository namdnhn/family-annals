import React, { useContext } from 'react';
import { View, Text, StyleSheet ,Dimensions,TouchableOpacity} from 'react-native';
import { Button } from 'react-native-elements';
import TokenContext from '../contexts/TokenContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { axiosInstance } from '../constants/Axios';
const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");
const standardWidth = 360;
const standardHeight = 800;
export default function UserScreen({ navigation }) {
  
  const [fontsLoaded] = useFonts({
    'GentiumBookBasic-Italic': require('./../../assets/fonts/GentiumBookBasic-Italic.ttf'),
    'Open-san': require('./../../assets/fonts/Montserrat-Bold.ttf')
  });
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  })
  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

  const logOut = async () => {
    navigation.navigate('Login');
    // try {
    //   // Gọi API logout từ phía backend
    //   const response = await axiosInstance.post('/users/logout');

    //   // Kiểm tra xem yêu cầu có thành công hay không
    //   if (response.status === 200) {
    //     // Xử lý khi logout thành công, ví dụ: chuyển hướng đến màn hình đăng nhập
    //     navigation.navigate('Login');
    //   } else {
    //     console.error('Logout failed');
    //   }
    // } catch (error) {
    //   console.error('Error during logout:', error);
    // }
  };
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginTop: 24 }}>
        <Ionicons name='ios-arrow-back' size={24} color='#5257D1'></Ionicons>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={styles.profileImage}>
          <Image source={require("../../assets/img/cho.jpg")} style={styles.image} resizeMode="center"></Image>
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.name}>Hoàng Nam</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={styles.edit1} onPress={() => navigation.navigate("EditProfile")}>
          <Text style={styles.edit2}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.edit3} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.edit2} onPress={logOut}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ marginLeft: 20, color: "black", fontFamily: "Open-san", fontSize: 20, marginBottom: 10 }}>Tra cứu thông tin</Text>
      
      <View style={{ height: 60 }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    overflow: 'hidden',
    marginLeft: 20
  },
  image: {
    flex: 1,
    borderRadius: 100,
    width: undefined,
    height: undefined
  },
  name: {
    color: 'black',
    marginLeft: 30,
    marginTop: 15,
    fontSize: 20
  },
  follow: {
    color: 'gray',
    fontSize: 17,
    marginTop: 5,
    marginLeft: 30,
  },
  edit1: {
    marginLeft: 25,
    marginTop: 15,
    marginBottom: 15,
    height: 40,
    width: 80,
    backgroundColor: 'green',
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  edit2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15
  },
  edit3: {
    marginLeft: 10,
    marginTop: 15,
    height: 40,
    width: 80,
    backgroundColor: 'green',
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonBackground: {
    backgroundColor: "white",
    borderColor: 'white',
    borderColor: 'white'
  },
  imgWrapper: {
    width: WIDTH / 2 - 15,
    height: 80,
    borderRadius: 10,
    borderColor: "black",
    marginLeft: 10,
    marginTop: 10,
    overflow: "hidden", // Hide any overflow content
    backgroundColor:'#2F2D38'
  },
  imgText: {
    marginLeft:10,
    marginTop:10,
    fontWeight:"bold",
    flex: 1,
    fontSize: 20,
    color: "black",
  },
  img: {
    width: WIDTH / 2 - 15,
    height: (100 / standardHeight) * HEIGHT,
  },
})