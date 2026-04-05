import { View, Text, ImageBackground } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function EarthquakeCard() {


  const [earthquake, setEarthquake] = useState(null);

    
    useFocusEffect(
        useCallback(() => {
      loadEarthquake();
      }, []));


   const loadEarthquake = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch('https://beakonek.onrender.com/api/v1/recentearthquakes', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    console.log(data);
    if (data.detail === "No recent earthquake logs found") {
          setEarthquake(null);
        } else {
          setEarthquake(data);
        }
    };


  

  const formatDate = (sent_at: string) => {
  const date = new Date(sent_at);
  return date.toLocaleString('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};


  return (
    <ImageBackground 
      source={require('../assets/images/earthquake-background.jpg')}
      className="rounded-[15px] self-stretch mx-8 h-[60%] mb-4 z-10 p-6 bg-[#747474]/40 border border-white/20"
      imageStyle={{ borderRadius: 15, opacity: 0.3 }}
      resizeMode="cover"
    >
      <View>
        <Text className='text-4xl text-[#FFA64D] font-bold'>
          {earthquake ? `Magnitude ${earthquake.magnitude}` : 'No recent activity'}
        </Text>
        <Text className='text-white mt-1'>
          {earthquake ? earthquake.place : 'Waiting for updates...'}
        </Text>
        <Text className='text-white mt-2'>
          {earthquake ? formatDate(earthquake.sent_at) : '--:-- --, -- ---- ----'}
        </Text>
      </View>
    </ImageBackground>
  );
}