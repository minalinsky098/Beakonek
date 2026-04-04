import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router, useRouter} from 'expo-router';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { House, UserPlus, Users, Menu, Check} from 'lucide-react-native';
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";


export default function TabLayout() {

   const router = useRouter();
    const [isConnected, setIsConnected] = useState(true);
  
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        const connected = state.isConnected && state.isInternetReachable;
        setIsConnected(connected);
        if (!connected) {
        router.replace("../offline");}
        if (connected) {
        router.replace("/home");}
      });
      return () => unsubscribe();}, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          borderTopColor: '#969696',
          borderTopWidth: 1,
          elevation: 0,
        },

      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <House size={24}  color={color} />,
        }}
      />

      <Tabs.Screen
       name = "add-contact"
       options={{
        title: 'Add Contact',
        tabBarIcon: ({ color }) => <UserPlus color={color} size={24} />,
        headerShown: false,
        headerTitle: 'New Contacts',
        headerTitleAlign: 'center',
      
       }}
       />

      <Tabs.Screen
        name="manage-contact"
        options={{
          title: 'Manage Contact',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
    
      <Tabs.Screen
       name = "menu"
       options={{
        title: 'Menu',
        tabBarIcon: ({ color }) => <Menu color={color} size={24} />,
       }}
       />
    </Tabs>
  );
}
