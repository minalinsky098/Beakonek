
import {View,Text, ScrollView} from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';




    const colors = ['#3723A9', '#FF6B2C', '#E91E63', '#009688', '#FF5722', '#673AB7', '#2196F3', '#4CAF50'];
    const formatNumber = (number: string) => 
         {const digits = number.replace('63', '');
        return `+63 ${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;};
    const getColor = (name: string) => {
    const index = name.charCodeAt(0) % colors.length;
        return colors[index];
        };
    


export default function ContactAvatar ()

{
    const [contacts, setContacts] = useState([]);

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




    return( 
    
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>

        {contacts.length > 0 ? (
            contacts.map((contact) => (

            <View key={contact.relative_id} className="items-center mr-6">

                <View style={{ backgroundColor: getColor(contact.relative_name) }}
                    className="w-16 h-16 rounded-full justify-center items-center mb-2">

                    <Text className="text-white text-xl font-bold">
                        {contact.relative_name.charAt(0).toUpperCase()}
                    </Text>

                </View>

                <Text className="font-bold">{contact.relative_name}</Text>
                <Text className="text-sm font-semibold">{formatNumber(contact.mobile_number)}</Text>

            </View>

            ))
        ) :
         (
            <View>
            <Text className="text-gray-500 m-auto">No contacts added yet</Text>
            </View>
        )}
        </ScrollView>
);
}