import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return { error: 'Location permission denied' };
    }
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const address = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    const addr = address[0] || {};
    const readable = [addr.name, addr.district, addr.city, addr.region].filter(Boolean).join(', ');
    return {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      address: readable || 'Location detected',
    };
  } catch (err) {
    console.log('Location error:', err);
    return { error: 'Could not get location' };
  }
};
