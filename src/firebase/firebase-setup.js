// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
// Add the Firebase products that you want to use
import "firebase/firestore";
import "firebase/storage";

firebase.initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = firebase.storage();

// Create a storage reference from our storage service
const storageRef = storage.ref();

const celebnames = storageRef.child("celebNames.json");
const words = storageRef.child("words.json");

export const fileURLs = {
  celebNames: celebnames.getDownloadURL(),
  words: words.getDownloadURL(),
};
