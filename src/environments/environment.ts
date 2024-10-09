
const firebaseConfig = {
  apiKey: "AIzaSyC8axTFyKr94NTyKYNsB9SxkpF_5RgUnbE",
  authDomain: "miller365.firebaseapp.com",
  projectId: "miller365",
  storageBucket: "miller365.appspot.com",
  messagingSenderId: "230721507217",
  appId: "1:230721507217:web:0a9e09af991c698222d430"
};

let urlLocal =  "http://127.0.0.1:8000/api/";
let urlServidor = "https://4de96d4f-ff25-4d89-ba26-b3baa72c839c.clouding.host/api/";

export const environment = {
  production: false,
  urlBase: urlLocal,
  firebaseConfig: firebaseConfig,
};