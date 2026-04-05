import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";
import * as SystemUI from 'expo-system-ui';
import { ImageBackground } from 'react-native'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import '@/tasks/location-task';


SystemUI.setBackgroundColorAsync('#3723A9');



export default function RootLayout() {

  
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(true);

useEffect(() => {
  let ready = false;

  const unsubscribe = NetInfo.addEventListener(state => {
    const connected = state.isConnected && state.isInternetReachable;
    setIsConnected(connected);

    if (!ready) {
      ready = true;
      return; // 👈 skip the first immediate fire
    }

    if (!connected) {
      router.replace("/offline");
    } else {
      router.replace("/");
    }
  });

  return () => unsubscribe();
}, []);

  return (

  <GestureHandlerRootView>
    <ThemeProvider value={DefaultTheme}>
    
     <ImageBackground 
        source={require('../assets/images/background-image.jpg')}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.2}}
      >

      <Stack initialRouteName='index'
             screenOptions={{
              animation: 'default',
              animationDuration: 500,
            }}
             >

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{headerShown: false}}/>
        <Stack.Screen name="login" options={{headerShown: false}}/>
         <Stack.Screen name="welcome" options={{headerShown: false}}/>
         <Stack.Screen name="index" options={{headerShown: false}}/>
         <Stack.Screen name="offline" options={{headerShown: false}}/>
        
      
      </Stack>
      <StatusBar style="auto" />

    </ImageBackground>
    </ThemeProvider>
  </GestureHandlerRootView>
  );

}
