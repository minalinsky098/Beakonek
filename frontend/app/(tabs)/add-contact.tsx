import {Text, View, Platform, TextInput} from "react-native";
import { router } from "expo-router";
import { KeyboardAvoidingView, KeyboardProvider } from "react-native-keyboard-controller";
import { useState } from "react";

export default function AddContacts ()
{
    const [phoneNumber, setPhoneNumber] = useState('');

    return(
         <KeyboardProvider>

        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >

         <View className="flex-1 ">

         <View className="rounded-[26px] flex-[4] bg-white pt-10 -mt-justify-center px-10">

           <View className="flex-row items-center bg-[#D9D9D9] rounded-[8px] border border-[#737373] mb-3">
           <TextInput
           placeholder="Enter First Name"
           className="flex-1 p-4"
           />
            </View>

           <View className="flex-row items-center bg-[#D9D9D9] rounded-[8px] border border-[#737373] mb-3">
           <TextInput
           placeholder="Enter Last Name"
           className="flex-1 p-4"
           />
            </View>

           <Text className="mb-3">Phone Number</Text>

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