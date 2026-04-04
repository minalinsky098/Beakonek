import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";
import * as SystemUI from 'expo-system-ui';
import { ImageBackground } from 'react-native'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SystemUI.setBackgroundColorAsync('#3723A9');



export default function RootLayout() {
  
  

  return (

  <GestureHandlerRootView>
    <ThemeProvider value={DefaultTheme}>
    
     <ImageBackground 
        source={require('../assets/images/background-image.jpg')}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.2}}
      >

      <Stack initialRouteName='welcome'
             screenOptions={{
              animation: 'slide_from_bottom',
              animationDuration: 500,
            }}
             >

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{headerShown: false}}/>
        <Stack.Screen name="login" options={{headerShown: false}}/>
         <Stack.Screen name="welcome" options={{headerShown: false}}/>
        
      
      </Stack>
      <StatusBar style="auto" />

    </ImageBackground>
    </ThemeProvider>
  </GestureHandlerRootView>
  );

}
