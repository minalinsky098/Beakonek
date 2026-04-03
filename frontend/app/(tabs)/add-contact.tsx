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
    const [error, setError] = useState('');
    const router = useRouter();

    
    const phoneverification = () => {
      if (phoneNumber.length !== 9) {
        console.log(phoneNumber);
        setError("Invalid phone number. Please enter a 9-digit number.");
        return;
      } else {
          
           setPhoneNumber('');
           setName('');
           setError('');
           handleSave();
      }
   
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
              relative_number: '639' + phoneNumber 
            }),
          });
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      };

      const addContact = () => {
        console.log("Pressed!");
        phoneverification();
        
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

           <View className="flex-row items-center bg-[#D9D9D9]  border border-[#737373] mb-6">
           <TextInput
           placeholder="Juan dela Cruz"
           className="flex-1 p-4"
           value={name}
           onChangeText={setName}
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
            {error ? (
                <Text className="text-red-500 text-sm mb-2">
                {error}
                </Text>
                ) : null}

        </View>
         
         
        </View>

    );
}