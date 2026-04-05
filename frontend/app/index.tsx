import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Image, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoadingScreen() {
  const router = useRouter();

useEffect(() => {
  const checkLogin = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/welcome');
    }
  };

  const timer = setTimeout(() => {
    checkLogin();
  }, 2000);

  return () => clearTimeout(timer); // 👈 cleanup
}, []);

  return (
   <View className="flex-1 justify-center items-center bg-[#3723A9]">
     <Image 
        source={require('../assets/images/background-image.jpg')}
        className="absolute w-full h-full opacity-20"
    />
   <Image 
        source={require('../assets/images/logo.png')} 
        className="w-40 h-40"/>
   <ActivityIndicator size="large" color="#fff" />
   </View>
  );
}