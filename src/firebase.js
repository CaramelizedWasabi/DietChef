// src/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase 설정
const firebaseConfig = {
  apiKey: 'AIzaSyAml1_x0_7NRN7l8xCZ8GWzv9TcuDD2rqU',
  authDomain: 'se-project-eb653.firebaseapp.com',
  databaseURL: 'https://se-project-eb653-default-rtdb.firebaseio.com',
  projectId: 'se-project-eb653',
  storageBucket: 'se-project-eb653.appspot.com',
  messagingSenderId: '254095775113',
  appId: '1:254095775113:web:563651a46788f18ff53d58',
};

// Firebase 앱 초기화 (중복 방지)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// 인증 객체 생성 + 로그인 상태 유지 설정
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error('Failed to set login status:', err);
});

// Google 로그인 제공자
const googleProvider = new GoogleAuthProvider();

// Realtime Database
const db = getDatabase(app);

// 내보내기
export { app, auth, googleProvider, db };

