import { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'react-native-feather';


export default function LoginScreen ()
{
const router = useRouter();
const [phoneNumber, setPhoneNumber] = useState('');
const [otp, setOtp] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [result, setResult] = useState('');
const [registered,setRegistered] = useState('');

const handleRequestOTP = async () => {
  try {
    const response = await fetch('https://interlunar-nella-lonelily.ngrok-free.dev/api/v1/requestOTP', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile_number: phoneNumber, purpose: 'registration'}),
    });
    const data = await response.json();
    setResult(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

const handleAuthOTP = async () => {
  try {
    const response = await fetch('https://interlunar-nella-lonelily.ngrok-free.dev/api/v1/authOTP', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile_number: phoneNumber, purpose: 'registration', otp: otp }),
    });
    const data = await response.json();
    setRegistered(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

    return (
      
         <View className="flex-1"> 
            <View className="flex-[6] bg-[#3723A9]"></View>

         <View className="rounded-[28px] flex-[6] bg-[#F5F5F5] p-10 -mt-16">
            <Text className="text-2xl font-bold mb-6 ">Sign up</Text>
            <Text className="mb-3">Phone Number</Text>
            <TextInput placeholder="639xxxxxxxxx"
            className="bg-[#D9D9D9] rounded-[8px] p-4 border border-[#737373] mb-3"
            keyboardType="phone-pad"
            maxLength={12}
            value={phoneNumber}
            onChangeText={setPhoneNumber}/>
            {result ? <Text className="text-black mt-3">{result}</Text> : null}
            

           
            <Text className="mb-3">OTP</Text>
            <TextInput placeholder="OTP"
            className="bg-[#D9D9D9] rounded-[8px] p-4 border border-[#737373] mb-3"
            keyboardType="phone-pad"
            maxLength={11}
            value={otp}
            onChangeText={setOtp}/>
            {registered ? <Text className="text-black mt-3">{registered}</Text> : null}
       

         

    
            <TouchableOpacity onPress={handleRequestOTP}
            className="bg-[#FF6B2C] p-5 rounded-[25px] mb-4">
                <Text className="text-center text-white">Send OTP</Text>
            </TouchableOpacity>

             <TouchableOpacity onPress={handleAuthOTP}
            className="bg-[#FFFFF] p-5 rounded-[25px] border border-[#737373]">
                <Text className="text-center">Register</Text>
            </TouchableOpacity>



            </View>
         
         
         </View>
      
    );
}
