import {View, Text, TouchableOpacity} from 'react-native';
import { CircleUserRound, SquarePen } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState, useEffect } from "react";


export default function Menu ()
{
    const [ user, setUser ] = useState([]);
    const router = useRouter();
    const loadUserData = async () => {
    
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch('https://beakonek.onrender.com/api/v1/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        const data = await response.json();
        console.log(data);
        setUser(data);
        } catch(error){
            console.log(error);
     }

    }

    useEffect(() => {
        loadUserData();
    },[]);

    const handleLogout = async () => {
    try {
        const token = await AsyncStorage.getItem('token');

        await fetch('https://beakonek.onrender.com/api/v1/logout', {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`
        },
        });

        await AsyncStorage.removeItem('token');
        router.replace('/login');
    } catch (error) {
        console.log(error);
    }
    };


    const simulateEarthquake = async () => {
    try {
        const response = await fetch('https://beakonek.onrender.com/api/v1/simulate_earthquakes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            latitude: 10.3157,
            longitude: 123.8854,
            earthquake_id: 'test_eq_001',
            magnitude: 6.7,
            place: 'Cebu City, Philippines',
        }),
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
    };

        return(
            <View className='p-6 flex-1'>
            <Text className='font-bold text-2xl'>Menu</Text>

            <View className='items-center gap-2'>

                <View className="w-40 h-40 mt-10 rounded-full bg-[#3723A9]/90 justify-center items-center">
                <CircleUserRound size={110} color= '#F5F5F5'/>
                </View>


                <View className='flex-row items-center gap-2'>
                    <Text className='text-2xl font-bold'>  {user ? `${user.first_name} ${user.last_name}` : ''}</Text>
                    <SquarePen size={16}/>
                </View>
                <Text className='text-l font-semibold'>{user?.mobile_number?`+63 ${user.mobile_number.slice(2)}`:''}</Text>
            </View>

            <TouchableOpacity onPress={simulateEarthquake}
            className="bg-[#FF6B2C] p-4 rounded-[25px] mt-4">
            <Text className="text-center text-white font-bold">Simulate Earthquake</Text>
            </TouchableOpacity>
            
           
            
            <TouchableOpacity className='bg-[#FFFFF] mt-auto p-4 rounded-[16px] border border-[#FF6B2C]'
            onPress={handleLogout}>
                <Text className='text-center text-[#FF6B2C]'>Log out</Text>
            </TouchableOpacity>
        </View>
    );
}