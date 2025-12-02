
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxZx728L-W5bvmNq3oIluryrS5G-AU0Ms",
  authDomain: "quiz-app-f197b.firebaseapp.com",
  projectId: "quiz-app-f197b",
  storageBucket: "quiz-app-f197b.firebasestorage.app",
  messagingSenderId: "604478945623",
  appId: "1:604478945623:web:8d89f2b24a7006c2a2a612",
  measurementId: "G-9DGG5GCRD0",
};

// ✅ Initialize Firebase App only once
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// ✅ Initialize Firestore with cache and fallback
let db: Firestore;
try {
  db = initializeFirestore(app, {
    localCache: memoryLocalCache(),
    experimentalForceLongPolling: true, // helps in some network environments
  });
} catch (e) {
  db = getFirestore(app);
}

// ✅ Initialize Auth
const auth: Auth = getAuth(app);

// ✅ Export instances
export { app, db, auth };
