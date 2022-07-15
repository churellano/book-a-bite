import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; //!!!!!!! UNCOMMENT AFTER initializeApp()...

// TODO: Replace with project configuration
//... recieved when creating Firebase Project in Firebase Console (online)
const config = {
    apiKey: "AIzaSyChlBIvQjCfupnHeXdIJGdHgYozc9-A7NM",
    authDomain: "cmpt-372-project.firebaseapp.com",
};

const firebaseApp = initializeApp(config);

export const auth = getAuth(firebaseApp); // global Authorization Service from Firebase 





