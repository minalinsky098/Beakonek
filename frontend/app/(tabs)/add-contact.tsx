import {Text, View, Platform, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { KeyboardAvoidingView, KeyboardProvider } from "react-native-keyboard-controller";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { Check } from "lucide-react-native";


export default function AddContacts ()
{
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');

    
    const phoneverification = () => {
      if (phoneNumber.length !== 9) {
        setError("Invalid phone number. Please enter a 9-digit number.");
        return;
      }
    }

  const handlePress = () => {
    console.log("Pressed!");
    
   };



     useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handlePress}
          className="mr-4 w-10 h-10 border-2 border-orange-500 rounded-full items-center justify-center"
        >
          <Check size={20} color="#FF6B35" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

    

    return(
         <KeyboardProvider>

        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >

         <View className="flex-1 ">

         <View className="rounded-[26px] flex-[4] bg-white pt-10 -mt-justify-center px-10">
     
          <Text className="mb-3 font-semibold">Name</Text>

           <View className="flex-row items-center bg-[#D9D9D9] rounded-[8px] border border-[#737373] mb-6">
           <TextInput
           placeholder="Juan dela Cruz"
           className="flex-1 p-4"
           />
            </View>


           <Text className="mb-3 font-semibold">Phone Number</Text>

           <View className="flex-row items-center bg-[#D9D9D9] rounded-[8px] border border-[#737373] mb-3">
           <Text className="p-2 text-black border-r border-[#737373]">+639</Text>
           <TextInput
           placeholder="XXXXXXXXX"
           className="flex-1 p-4"
           keyboardType="phone-pad"
           maxLength={9}
           value={phoneNumber}
          onChangeText={setPhoneNumber}
          />
          </View>

         </View>
         
         
         </View>

         </KeyboardAvoidingView>

      </KeyboardProvider>
      
    );
}