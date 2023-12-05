// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDSeQa2RTXx5o-ffcfaJoaMYkWaPKl4K9E",
	authDomain: "head-hunter-b9ee2.firebaseapp.com",
	projectId: "head-hunter-b9ee2",
	storageBucket: "head-hunter-b9ee2.appspot.com",
	messagingSenderId: "195084099908",
	appId: "1:195084099908:web:b4cf2a9671a7e6fe133711",
	measurementId: "G-Q7B0S2QRPQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;