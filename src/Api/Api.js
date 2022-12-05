import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiBaseUrl = 'https://www.machinrun.islapps.tech/backend/public/api/';

// let url = 'https://behbud-server.herokuapp.com';
// let url = 'http://localhost:3001';

const instance = axios.create({
  baseURL: apiBaseUrl,
});

instance.interceptors.request.use(
  async config => {
    await AsyncStorage.getItem('userInfo').then(userInfo => {
      if (userInfo != null) {
        let uInfo = JSON.parse(userInfo);
        if (uInfo.token) {
          config.headers.Authorization = `Bearer ${uInfo.token}`;
        }
      }
    });
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

export default instance;
