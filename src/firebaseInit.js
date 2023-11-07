/* eslint-disable */
import 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// import { firebaseConfig } from 'utils/variable';

const firebaseConfig = {
  apiKey: 'AIzaSyBRM9Lj2yqX17SXtsYEyhu52lF-lgtSDAs',
  authDomain: 'hyper-tech-dev.firebaseapp.com',
  projectId: 'hyper-tech-dev',
  storageBucket: 'hyper-tech-dev.appspot.com',
  messagingSenderId: '905495457471',
  appId: '1:905495457471:web:04a8cfec563464971ee00a',
  measurementId: 'G-253H05SPRJ',
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const fetchFirebaseToken = async () => {
  await getToken(messaging, {
    vapidKey: 'BJt5S_hp9vXqkVL056LVwn0wrBR0L1bHO3LK1dB9C3TbfealjWh5nVMbG_I-O4Tvp5dcDfjhf_EfzgANC9PsCn4',
  })
    .then(async (currentToken) => {
      if (currentToken) {
        localStorage.setItem('firebaseToken', currentToken);
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
