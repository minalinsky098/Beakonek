  import { useState } from "react";
  import {View, Text, TextInput, TouchableOpacity,Platform,Image} from 'react-native';
  import { useRouter } from 'expo-router';
  import { KeyboardAvoidingView, KeyboardProvider } from "react-native-keyboard-controller";
  import { Phone } from 'lucide-react-native';
  import Otp from "./otp";
  import AsyncStorage from '@react-native-async-storage/async-storage';
 
 
 
 
  export default function SignUpScreen ()
  {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showotp, setShowOtp] = useState(false);
  const [error, setError] = useState('');
  const [error2, setError2] = useState('');
  const [keyboardEnabled, setKeyboardEnabled] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
 
  const handleRequestOTP = async () => {
    try {
      const response = await fetch('https://beakonek.onrender.com/api/v1/otp/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        mobile_number: '+63' + phoneNumber, 
        purpose: 'registration'}),
      });
      const data = await response.json();
 

      if (!response.ok)
       {
        setError("This number is already registered. Please log in instead.");
        return false;
      }
 
      console.log(data);
      console.log("This is request");
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
 
  const handleAuthOTP = async () => {
    try {
      const response = await fetch('https://beakonek.onrender.com/api/v1/otp/authentications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        mobile_number: '+63' + phoneNumber,
        purpose: 'registration',
        otp: otp }),
      });
      console.log(response.status);
      const data = await response.json();
      console.log(data);
      console.log("This is auth");
      return(data);
    } catch (error) {
      console.log(error);
    }
  };
 
  const inputverification = async () => {
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError2("Name must be at least 2 characters");
      return;
    }
    if (phoneNumber.length !== 10) {
      setError("Invalid phone number. Please enter a 10-digit number.");
      return;
    }
   
    if (!phoneNumber.startsWith('9')) {
      setError("Phone number must start with 9");
      return;
    }
 
    setError2("");
    setError("");
 
    const success = await handleRequestOTP();
    if (!success) return; // already registered or request failed
 
    setShowOtp(true);
    setKeyboardEnabled(!keyboardEnabled);
  };
 
  const handleVerify = async () => {
    const response =  await handleAuthOTP();
 
    if (response.detail === "Incorrect OTP") {
      setError("Invalid OTP. Please try again.");
    } else {
      setError("");
      alert("✅ User Registered!");
      setShowOtp(false);
      
      setKeyboardEnabled(!keyboardEnabled)
      router.replace('/login');
    }
  };//delete later
 
      return (
        
          <KeyboardProvider>
 
            <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled={keyboardEnabled}
            >
 
          <View className="flex-1 "> 
              <View className="flex-[6] bg-[#3723A9] items-center justify-center">
                <Image 
                source={require('../assets/images/background-image.jpg')}
                className="absolute w-full h-full opacity-20"
                />
                <Image 
                source={require('../assets/images/logo.png')}
                style={{width: 200, height: 200}}
                />
              </View>
 
          <View className="rounded-[28px] flex-[6] bg-[#F5F5F5] p-10 -mt-16">
              <Text className="text-2xl font-bold mb-5 ">Sign up</Text>
 
            <View className="flex-row items-center bg-[#D9D9D9] rounded-[8px] border border-[#737373] mb-3">
            <TextInput
              placeholder="Last Name"
              className="flex-1 p-4"
              value={lastName}
              onChangeText={(text) => {
              setLastName(text);
              setError2("");
              }}
            />
            </View>
 
              {error2 ? (
                <Text className="text-red-500 text-sm mb-2">
                  {error2}
                </Text>
              ) : null}
 
            <View className="flex-row items-center bg-[#D9D9D9] rounded-[8px] border border-[#737373] mb-3">
            <TextInput
              placeholder="First Name"
              className="flex-1 p-4"
              value={firstName}
              onChangeText={(text) => {
              setFirstName(text);
              setError2("");
            }}
            />
            </View>
 
              {error2 ? (
                <Text className="text-red-500 text-sm mb-2">
                  {error2}
                </Text>
              ) : null}
 
            <Text className="mb-3 font-semibold">Phone Number</Text>
              
 
            <View className="flex-row items-center bg-[#D9D9D9] rounded-[8px] border border-[#737373] mb-3">

            <Text className="p-4 text-black border-r border-[#737373]">+63</Text>
            <TextInput
            placeholder="9XXXXXXXX"
            className="flex-1 p-4"
            keyboardType="phone-pad"
            maxLength={10}
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
 
            
  
 
          
 
      
              <TouchableOpacity onPress={inputverification}
              className="bg-[#FF6B2C] p-5 rounded-[25px] mb-4">
                  <Text className="text-center text-white">Send OTP</Text>
              </TouchableOpacity>
              
              <Otp
                  visible={showotp}
                  onClose={() => {setShowOtp(false);
                  setKeyboardEnabled(!keyboardEnabled);
                  }
                  }
                  otp={otp}
                  setOtp={setOtp}
                  error={error}
                  onVerify={handleVerify}
                  onResend={inputverification}/>
              
 
              <TouchableOpacity onPress={()=> router.replace('/login')}
              className="bg-[#FFFFF] p-5 rounded-[25px] border border-[#737373]">
                  <Text className="text-center">Already have an account?</Text>
              </TouchableOpacity>
 
          
 
 
              </View>
          
          
          </View>
 
          </KeyboardAvoidingView>
 
        </KeyboardProvider>
        
      );
  }