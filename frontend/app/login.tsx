import { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'react-native-feather';
import { Phone } from 'react-native-feather';

export default function LoginScreen ()
{
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    return (
      
         <View className="flex-1"> 
            <View className="flex-[6] bg-[#3723A9]"></View>

         <View className="rounded-[28px] flex-[6] bg-[#F5F5F5] p-10 -mt-16">
            <Text className="text-2xl font-bold mb-6 ">Log in</Text>
            <Text className="mb-3">Phone Number</Text>
            <TextInput placeholder="0967xxxxxxx"
            className="bg-[#D9D9D9] rounded-[8px] p-4 border border-[#737373] mb-3"/>
       

            <View className="relative">
                <Text className="mb-3">Password</Text>
                <TextInput placeholder="**********"
                className="bg-[#D9D9D9] rounded-[8px] p-4 border border-[#737373] mb-3"
                secureTextEntry={!showPassword}/>
                <TouchableOpacity
                    className="absolute right-4 top-1/2 -translate-y1/2"
                    onPress={() => setShowPassword(!showPassword)}
                >
                <Text>{showPassword? <EyeOff stroke="gray" width={24} height={24} />
                 : <Eye stroke="gray" width={24} height={24} />}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity className="mb-6">
                <Text className="text-right text-sm">Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
            className="bg-[#FF6B2C] p-5 rounded-[25px] mb-4">
                <Text className="text-center text-white">Login</Text>
            </TouchableOpacity>

             <TouchableOpacity
            className="bg-[#FFFFF] p-5 rounded-[25px] border border-[#737373]">
                <Text className="text-center">Create new account</Text>
            </TouchableOpacity>



            </View>
         
         
         </View>
      
    );
}
