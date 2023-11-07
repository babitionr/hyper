importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyBRM9Lj2yqX17SXtsYEyhu52lF-lgtSDAs',
  authDomain: 'hyper-tech-dev.firebaseapp.com',
  projectId: 'hyper-tech-dev',
  storageBucket: 'hyper-tech-dev.appspot.com',
  messagingSenderId: '905495457471',
  appId: '1:905495457471:web:04a8cfec563464971ee00a',
  measurementId: 'G-253H05SPRJ',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
