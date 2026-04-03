import {View, Text, TouchableOpacity} from 'react-native';
import { CircleUserRound, SquarePen } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Menu ()
{
    return(
        <View className='p-6 flex-1'>
            <Text className='font-bold text-2xl'>Menu</Text>

            <View className='items-center gap-2'>

                <View className="w-40 h-40 mt-10 rounded-full bg-[#3723A9]/90 justify-center items-center">
                <CircleUserRound size={110} color= '#F5F5F5'/>
                </View>


                <View className='flex-row items-center'>
                    <Text className='text-2xl font-bold'>User </Text>
                    <SquarePen size={16}/>
                </View>
                <Text className='text-l font-semibold'>+639 XXXXXXXXX</Text>
            </View>
            
           
            
            <TouchableOpacity className='bg-[#FFFFF] mt-auto p-4 rounded-[16px] border border-[#FF6B2C]'>
                <Text className='text-center text-[#FF6B2C]'>Log out</Text>
            </TouchableOpacity>
        </View>
    );
}