import {Text, View, TouchableOpacity, Image, Platform, TextInput, ScrollView  } from "react-native";
import { router } from "expo-router";
import { KeyboardAvoidingView, KeyboardProvider } from "react-native-keyboard-controller";
import { Ionicons } from '@expo/vector-icons';
import { Pencil, Trash2 } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const colors = ['#3723A9', '#FF6B2C', '#E91E63', '#009688', '#FF5722', '#673AB7', '#2196F3', '#4CAF50'];

const getColor = (name: string) => {
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export default function IntroScreen() 
{

  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');

  useFocusEffect(
      useCallback(() => {
    loadContacts();
    }, []));

  const loadContacts = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch('https://beakonek.onrender.com/api/v1/relatives', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    console.log(data);
    setContacts(data);
    };


  const filtered = contacts.filter(contact =>
    contact.relative_name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, contact) => {
    const letter = contact.relative_name.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(contact);
    return acc;
  }, {} as Record<string, typeof contacts>);

  const sortedKeys = Object.keys(grouped).sort();




  const deleteContact =  async (relative_id: string) => {

    setContacts((contacts) => contacts.filter((contact) => contact.relative_id !== relative_id));

    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(
        `https://beakonek.onrender.com/api/v1/relatives/${relative_id}`, 
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,

          },
        });

     const data = await response.json();
     if (!response.ok) {
      console.log('Delete failed:', data);
      return;
     }
     //setContacts(prev => prev.filter(contact => contact.relative_id !== relative_id));

     console.log('Delete succesfully', data);

    } catch (error)
    {
      console.log('bro');
      console.log(error);
    }
  }

  return (
     <View className="flex-[1] bg-[#3723A9]">
        <Image source={require('../../assets/images/background-image.jpg')}
          className="absolute w-full h-full opacity-20"/> 

        <View className="flex-[1] bg-[#3723A9]">
          <Image 
            source={require('../../assets/images/background-image.jpg')}
            className="absolute w-full h-full opacity-20"/>
          <Text className="text-2xl font-bold text-white mt-10 mx-6 mb-6">Manage Contacts</Text>
          <KeyboardProvider>

        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >

        <View className="flex-row items-center bg-[white] rounded-[8px] border border-[#737373] mb-3 mx-6 px-2">
  
        <Ionicons name="search" size={20} color="#000000" />

        <TextInput
          placeholder="Looking for someone?"
          className="flex-1 p-2 ml-2"
          value={search}
          onChangeText={setSearch}
        />

        </View>

        </KeyboardAvoidingView>

        </KeyboardProvider>
        </View>
        

        <View className="rounded-t-[26px] flex-[4] bg-white pt-10 -mt-justify-center px-10">

          <ScrollView showsVerticalScrollIndicator={false}>

            {sortedKeys.length > 0 ? (
              sortedKeys.map(letter => (
                <View key={letter}>

                  <Text className="text-gray-400 font-bold text-sm mb-1 mt-2">{letter}</Text>

                  {grouped[letter].map((contact, index) => (
                    <View key={contact.relative_id}>

                      <View className="flex-row items-center py-2 px-1">
                        
                        <View style={{ backgroundColor: getColor(contact.relative_name) }}
                          className="w-10 h-10 rounded-full justify-center items-center mr-4">

                          <Text className="text-white font-bold">
                            {contact.relative_name.charAt(0).toUpperCase()}
                          </Text>

                        </View>

                        <Text className="flex-1 font-semibold">{contact.relative_name}</Text>

                        <TouchableOpacity className="mr-5">

                          <Pencil size={20} color="black" />

                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => deleteContact(contact.relative_id)}>

                          <Trash2 size={20} color="black" />

                        </TouchableOpacity>
                      </View>

                      {index < grouped[letter].length - 1 && (
                        <View className="border-b border-gray-200 mx-1" />
                      )}
                    </View>

                  ))}
                  <View className="mb-3" />

                </View>
              ))

            ) : (
              <View className="items-center justify-center py-8">
                <Text className="text-gray-500">No contacts found</Text>
              </View>
            )}

          </ScrollView>

        </View>  

      </View>
  );
}