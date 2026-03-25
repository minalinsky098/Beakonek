import { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';

export default function LoginScreen ()
{
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    return (
      
         <View className="flex-1 flex-col"> 
            <View className="flex-[6] bg-[#3723A9]"></View>

         <View className="flex-[5] bg-[#F5F5F5] p-6 rounded-[24px]">
            <Text>login</Text>
            </View>
         
         
         </View>
      
    );
}
