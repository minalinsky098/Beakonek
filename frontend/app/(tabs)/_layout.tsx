import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { House, UserPlus, Users, Menu} from 'lucide-react-native';


export default function TabLayout() {
  
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
