import { Platform, Alert } from 'react-native';

let notificationToken = null;

export const registerForPushNotifications = async (userId) => {
  // Push notifications require a development build, not Expo Go
  // For now we use local alerts as placeholder
  console.log('Push notifications will work in production build');
  return null;
};

export const addNotificationListener = (handler) => {
  return { remove: () => {} };
};

export const addNotificationResponseListener = (handler) => {
  return { remove: () => {} };
};

export const sendLocalNotification = (title, body) => {
  Alert.alert(title, body);
};
