import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { House, UserPlus, Users, Menu, Check} from 'lucide-react-native';


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
        headerShown: true,
        headerTitle: 'New Contacts',
        headerTitleAlign: 'center',
        headerRight: () => (
          <TouchableOpacity onPress={() => router.push('./home')} className="mr-4 w-10 h-10 border-2 border-orange-500 rounded-full items-center justify-center">
            <Check size={20} color="#FF6B35" />
          </TouchableOpacity>
        ),
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
