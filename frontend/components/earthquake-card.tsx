import { View, Text, ImageBackground } from 'react-native';
import { useState } from 'react';

export default function EarthquakeCard() {
  const [earthquake, setEarthquake] = useState(null);

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
          {earthquake ? earthquake.location : 'Waiting for updates...'}
        </Text>
        <Text className='text-white mt-2'>
          {earthquake ? earthquake.time : '--:-- --, -- ---- ----'}
        </Text>
      </View>
    </ImageBackground>
  );
}