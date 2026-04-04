import {Text, View, Platform, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, KeyboardProvider } from "react-native-keyboard-controller";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { Check } from "lucide-react-native";


export default function AddContacts ()
{

    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [nameError, setNameError] = useState('');


    
    const loginValidation = () => {

      if (name.length < 2)
      {
        console.log(phoneNumber);
        setNameError("Name must be at least 2 characters");
        return;
      }

      if (phoneNumber.length !== 10) {
        console.log(phoneNumber);
        setPhoneError("Invalid phone number. Please enter a 10-digit number.");
        return;
      } 
      if (!phoneNumber.startsWith('9')) {
      setPhoneError("Phone number must start with 9.");
      return;
      }
      setPhoneNumber('');
      setName('');
      setPhoneError('');
      setNameError('');
      handleSave();
      
   
    }


      const handleSave = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          
          const response = await fetch('https://beakonek.onrender.com/api/v1/relatives',
             {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
              relative_name: name, 
              relative_number: '63' + phoneNumber 
            }),
          });
          const data = await response.json();
          console.log(data);

        } catch (error) {
          console.log('what')
          console.log(error);
        }
      };

      const addContact = () => {
        loginValidation();
        
      };



    
    

    return(
     

      <View className="flex-1 bg-white">
  
      <View className="flex-row p-6 mt-10 bg-white shadow-md justify-between items-center relative border-b border-[#969696]">
        <Text className='text-center flex-1 text-2xl font-bold'>New Contact</Text>
    
     <TouchableOpacity onPress={addContact} 
     className="mr-4 w-10 h-10 border-2 border-orange-500 rounded-full items-center justify-center">
      <Check size={20} color="#FF6B35" />
        </TouchableOpacity>
        
    </View>
      <View className=" flex-[8] bg-white pt-10 -mt-justify-center px-10">
     
          <Text className="mb-3 font-semibold">Name</Text>

           <View className="flex-row items-center bg-[#D9D9D9] rounded-[8px]  border border-[#737373] mb-6">
           <TextInput
           placeholder="Juan Dela Cruz"
           className="flex-1 p-4"
           value={name}
           onChangeText={setName}
           maxLength={12}
           />
            </View>
            {nameError ? (
                <Text className="text-red-500 text-sm mb-2">
                {nameError}
                </Text>
                ) : null}


           <Text className="mb-3 font-semibold">Phone Number</Text>

          <View className="flex-row items-center bg-[#D9D9D9] rounded-[8px] border border-[#737373] mb-3">
           <Text className="p-2 text-black border-r border-[#737373]">+63</Text>
           <TextInput
           placeholder="XXXXXXXXX"
           className="flex-1 p-4"
           keyboardType="phone-pad"
           maxLength={10}
           value={phoneNumber}
           onChangeText={setPhoneNumber}
      
          />
          </View>
            {phoneError ? (
                <Text className="text-red-500 text-sm mb-2">
                {phoneError}
                </Text>
                ) : null}

        </View>
         
         
        </View>

    );
}