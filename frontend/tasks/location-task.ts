import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK = 'background-location';

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }: any) => {
  if (error) return;
  const { locations } = data;
  const { latitude, longitude } = locations[0].coords;

  const token = await AsyncStorage.getItem('token');
  await fetch('https://beakonek.onrender.com/api/v1/location', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ latitude, longitude }),
  });
});

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

export const startBackgroundLocation = async () => {
  try {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Background location permission denied');
      return;
    }

    const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK).catch(() => false);
    if (!isRunning) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 30000,
        distanceInterval: 0,
        showsBackgroundLocationIndicator: true,
      });
      console.log('Background location started');
    }
  } catch (error) {
    console.log('Background location failed', error);
  }
};