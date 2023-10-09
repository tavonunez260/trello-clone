// Import the functions you need from the SDKs you need
import { getFirestore } from '@firebase/firestore';
import { getStorage } from '@firebase/storage';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: process.env['API_KEY '],
	authDomain: process.env['AUTH_DOMAIN '],
	projectId: 'trello-clone-project-cf5b6',
	storageBucket: process.env['STORAGE_BUCKET '],
	messagingSenderId: process.env['MESSAGING_SENDER_ID '],
	appId: process.env['APP_ID'],
	measurementId: process.env['MEASUREMENT_ID ']
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
