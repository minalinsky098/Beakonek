import {Text, View, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";

export default function IntroScreen() 
{
  return (
  <LinearGradient colors={['#3723A9', 'black']} start={{x:0, y:0}} end={{x:0, y:.9}} style={{flex:1}}>
      <Image 
      source={require('../assets/images/background-image.jpg')}
      className="absolute w-full h-full opacity-10"
      resizeMode="cover"
      />

       <View className="flex-[6] justify-end items-center">
     <Image 
                source={require('../assets/images/logo.png')}
                  style={{width: 200, height: 200}}
                  />
    </View>
    <View className="flex-[3] justify-end items-center">
      <Text className="text-3xl font-bold text-white">Message Who Matters</Text>
      <Text className="text-white text-sm mt-2">Flawless SMS delivery for maximum assistance</Text>
    </View>
    
    
      <View className="flex-[3] justify-center items-center">
        <TouchableOpacity onPress={() => router.push('/signup')}
            className="bg-[#FF6B2C] p-4 rounded-[25px] mb-4 w-64">
                <Text className="text-center text-white text-lg">Sign Up</Text>
        </TouchableOpacity>

        <Text className="text-white">
              <Text style={{textDecorationLine: 'underline'}} 
              onPress={() => router.push('/login')}>Already have an account?</Text>
        </Text>

      </View>
      
    </LinearGradient>
  );
};

