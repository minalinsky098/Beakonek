import { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import { User, Bell } from 'lucide-react-native';


export default function Home ()
{
  return (
    <View className="flex-1"> 
            <View className="flex-[6] bg-[#3723A9] justify-center items-center">


                <Image 
                source={require('../../assets/images/background-image.jpg')}
                className="absolute w-full h-full opacity-20 z-0"
                />

                <View className="bg-[#FFFFFF] rounded-[15px] self-stretch mx-8 h-[60%] mb-4 z-10 p-6">
                  <Text>Earthquake Card</Text>
                </View>

                

            </View>
            

            <View className="rounded-[28px] flex-[8] bg-[#F5F5F5] p-6 -mt-16">
      
                <View className="flex-[4]">
                  <View className="flex-row gap-2 items-center" >
                    <User size={30} />
                    <Text className="text-2xl font-bold p-2">Contacts</Text>
                  </View>

                </View>

                <View className="flex-[9]">
                  <View className="flex-row gap-2 items-center" >
                    <Bell size={30}/>
                    <Text className="text-2xl font-bold p-2">Logs</Text>
                  </View>
                </View>

            </View>

    </View>
  )
}