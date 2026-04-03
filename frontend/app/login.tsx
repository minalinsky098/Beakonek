import { useState } from "react";
import {View, Text, TextInput, TouchableOpacity,Platform, Image} from 'react-native';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, KeyboardProvider } from "react-native-keyboard-controller";
import Otp from "./otp";






export default function LoginScreen ()
{
const router = useRouter();
const [phoneNumber, setPhoneNumber] = useState('');
const [otp, setOtp] = useState(''); //idk san to ginamit gawa nalang ako ng akin hahahahah 
const [showotp, setShowOtp] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [result, setResult] = useState('');
const [registered,setRegistered] = useState('');
const [keyboardEnabled, setKeyboardEnabled] = useState(true);


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

const phoneverification = () => {
  if (phoneNumber.length !== 9) {
    setError("Invalid phone number. Please enter a 9-digit number.");
    return;
  }
    setError("");
    setShowOtp(true);
    setKeyboardEnabled(!keyboardEnabled);
  }


const handleVerify = () => {
  if (otp !== "123456") {
    setError("Invalid OTP. Please try again.");
  } else {
    setError("");
    alert("✅ Verified!");
    setShowOtp(false);
    router.replace('/(tabs)/home');
  }
};//delete later

    return (
      
   <KeyboardProvider>

     <KeyboardAvoidingView
     style={{ flex: 1 }} 
     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
     enabled={keyboardEnabled}>
         <View className="flex-1 "> 
            <View className="flex-[6] bg-[#3723A9]">
                <Image 
                  source={require('../assets/images/background-image.jpg')}
                  className="absolute w-full h-full opacity-20"
                  />
              </View>


            
            <View className="flex-[4]" >
              <View className="rounded-[28px]  bg-[#F5F5F5] p-10 -mt-16">
                  <Text className="text-2xl font-bold mb-6 ">Log in</Text>
                  <Text className="mb-3 font-semibold">Phone Number</Text>

                <View className="flex-row items-center bg-[#D9D9D9] rounded-[8px] border border-[#737373] mb-3">
                <Text className="p-4 text-black border-r border-[#737373]">+639</Text>
                <TextInput
                placeholder="XXXXXXXXX"
                className="flex-1 p-4"
                keyboardType="phone-pad"
                maxLength={9}
                value={phoneNumber}
                onChangeText={(text) => {
                setPhoneNumber(text);
                setError(""); 
               }}
                />
                </View>

                {error ? (
                <Text className="text-red-500 text-sm mb-2">
                {error}
                </Text>
                ) : null}
    
            

           
 

         

    
            <TouchableOpacity onPress={phoneverification}
            className="bg-[#FF6B2C] p-5 rounded-[25px] mb-4">
                <Text className="text-center text-white">Send OTP</Text>
             </TouchableOpacity>;
            
            <Otp
               visible={showotp}
               onClose={() => {setShowOtp(false);
                setKeyboardEnabled(!keyboardEnabled);
               }
               }
               otp={otp}
               setOtp={setOtp}
               error={error}
               onVerify={handleVerify}/>

             <TouchableOpacity onPress={()=> router.replace('/signup')}
            className="bg-[#FFFFF] p-5 rounded-[25px] border border-[#737373]">
                <Text className="text-center">Create Account</Text>
            </TouchableOpacity>
            </View>
        </View>
      
         
   </View>

</KeyboardAvoidingView>
</KeyboardProvider>

         
    );
}
