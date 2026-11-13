import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

export const app = initializeApp({
  apiKey: "AIzaSyBnD2qS2TLKvFRFTi5HxWMIo4CPXaQ3FVM",
  authDomain: "itn-4-4a63e.firebaseapp.com",
  databaseURL: "https://itn-4-4a63e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "itn-4-4a63e",
  storageBucket: "itn-4-4a63e.firebasestorage.app",
  messagingSenderId: "764157056750",
  appId: "1:764157056750:web:38fdbe924f9518273ec5ff"
});
export const auth = getAuth(app);
export const db = getDatabase(app);
