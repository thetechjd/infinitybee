import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyDY3vrDhjTZ9S62YsuOTJp0MuhxdhmB-fM",
  authDomain: "beandbee-39cba.firebaseapp.com",
  projectId: "beandbee-39cba",
  storageBucket: "beandbee-39cba.appspot.com",
  messagingSenderId: "800319144140",
  appId: "1:800319144140:web:80703e900cc88b59e78269"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth();

export default {
  app,
  auth
}