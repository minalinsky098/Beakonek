import {Text, View, TouchableOpacity, Image, Platform, TextInput  } from "react-native";
import { router } from "expo-router";
import { KeyboardAvoidingView, KeyboardProvider } from "react-native-keyboard-controller";
import { Ionicons } from '@expo/vector-icons';

export default function IntroScreen() 
{
  return (
     <View className="flex-[1] bg-[#3723A9]">
        <Image source={require('../../assets/images/background-image.jpg')}
          className="absolute w-full h-full opacity-20"/> 

        <View className="flex-[1] bg-[#3723A9]">
          <Image 
            source={require('../../assets/images/background-image.jpg')}
            className="absolute w-full h-full opacity-20"/>
          <Text className="text-2xl font-bold text-white mt-10 mx-6 mb-3">Manage Contacts</Text>
          <KeyboardProvider>

        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >

        <View className="flex-row items-center bg-[white] rounded-[8px] border border-[#737373] mb-3 mx-6 px-2">
  
        <Ionicons name="search" size={20} color="#000000" />

        <TextInput
          placeholder="Looking for someone?"
          className="flex-1 p-2 ml-2"
        />

        </View>

        </KeyboardAvoidingView>

        </KeyboardProvider>
        </View>
        

        <View className="rounded-t-[26px] flex-[4] bg-white pt-10 -mt-justify-center px-10">
        </View>  

      </View>
  );
}