import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyACfUR1tmMLp0YRkVDBiRmMGJ5rdMuK_VY",
  authDomain: "beandbee-38cba.firebaseapp.com",
  projectId: "beandbee-38cba",
  storageBucket: "beandbee-38cba.appspot.com",
  messagingSenderId: "296445192075",
  appId: "1:296445192075:web:4da5127fe15743c82ab18e"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth();

export default {
  app,
  auth
}