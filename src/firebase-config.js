import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const config = {
    apiKey: 'AIzaSyChlBIvQjCfupnHeXdIJGdHgYozc9-A7NM',
    authDomain: 'cmpt-372-project.firebaseapp.com',
}

const firebaseApp = initializeApp(config)

// global Authorization Service from Firebase
export const auth = getAuth(firebaseApp)
