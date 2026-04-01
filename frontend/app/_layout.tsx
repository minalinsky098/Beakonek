import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";
import * as SystemUI from 'expo-system-ui';

SystemUI.setBackgroundColorAsync('#3723A9');



export default function RootLayout() {
  

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack initialRouteName='(tabs)'
             screenOptions={{
              animation: 'slide_from_bottom',
            }}
             >

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{headerShown: false}}/>
        <Stack.Screen name="login" options={{headerShown: false}}/>
        
      
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
