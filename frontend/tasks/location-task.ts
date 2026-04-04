import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const updateLocation = async () => 
{
  try {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
  console.log('Location permission denied');
  return;
  }
 
  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;
  console.log('Location:', latitude, longitude);
  const token = await AsyncStorage.getItem('token');
  const response = await fetch('https://beakonek.onrender.com/api/v1/location', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ latitude, longitude }),
  });
  const data = await response.json();
  console.log(data);
    }catch(error)
{
    console.log('Location update failed',error);
}

}