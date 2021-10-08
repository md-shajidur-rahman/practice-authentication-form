import {initializeApp} from 'firebase/app';
import firebaseConfig from './firebase.confiq';


const initializeAuthentication = () => {
    initializeApp(firebaseConfig);
}

export default initializeAuthentication;
