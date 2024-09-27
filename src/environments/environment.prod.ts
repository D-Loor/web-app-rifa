// import firebase from "firebase/compat/app";
// import "firebase/compat/firestore";
// import 'firebase/compat/auth'; 

const firebaseConfig = {
  apiKey: "AIzaSyC8axTFyKr94NTyKYNsB9SxkpF_5RgUnbE",
  authDomain: "miller365.firebaseapp.com",
  projectId: "miller365",
  storageBucket: "miller365.appspot.com",
  messagingSenderId: "230721507217",
  appId: "1:230721507217:web:0a9e09af991c698222d430"
};

// firebase.initializeApp(firebaseConfig);
// export default firebase;
export const environment = {
  production: true,
  urlBase: 'https://electoral-sw.revolucionciudadana.com.ec/api/',
  firebaseConfig: firebaseConfig,
};