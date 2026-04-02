import { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, ScrollView} from 'react-native';
import { User, Bell } from 'lucide-react-native';
import EarthquakeCard from "@/components/earthquake-card";
import ContactAvatar from "@/components/contact-avatar";
import LogsList from "@/components/log-item";



export default function Home ()
{


  return (
    <View className="flex-1"> 
            <View className="flex-[6] bg-[#3723A9] justify-center items-center">

                <Image 
                source={require('../../assets/images/background-image.jpg')}
                className="absolute w-full h-full opacity-20 z-0"
                />

                <EarthquakeCard/>

            </View>
            

            <View className="rounded-[28px] flex-[8] bg-[#F5F5F5] p-6 -mt-16">
      
                <View className="flex-[4]">
                  <View className="flex-row gap-2 items-center" >
                    <User size={30} />
                    <Text className="text-2xl font-bold p-2">Contacts</Text>
                  </View>

                  <ContactAvatar/>

                </View>


                <View className="flex-[8] mt-6">
                  <View className="flex-row gap-2 items-center" >
                    <Bell size={30}/>
                    <Text className="text-2xl font-bold p-2">Logs</Text>
                  </View>

                  <LogsList/> 
                </View>

               

            </View>

    </View>
  )
}