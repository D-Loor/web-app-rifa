// import firebase from "firebase/compat/app";
// import "firebase/compat/firestore";
// import 'firebase/compat/auth'; 

const firebaseConfig = {
  apiKey: "AIzaSyDQxms_iwz4K06ebhiWp42OISqMz8d2O0U",
  authDomain: "electoral-control-system.firebaseapp.com",
  projectId: "electoral-control-system",
  storageBucket: "electoral-control-system.appspot.com",
  messagingSenderId: "658494802906",
  appId: "1:658494802906:web:c991e1635f4a793ee18ee3",
  measurementId: "G-KYRPHPTX5G"
};

// firebase.initializeApp(firebaseConfig);
// export default firebase;
export const environment = {
  production: false,
  urlBase: 'http://127.0.0.1:8000/api/',
  firebaseConfig: firebaseConfig,
};