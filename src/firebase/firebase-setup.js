// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
// Add the Firebase products that you want to use
import "firebase/firestore";
import "firebase/storage";

import { v5 as uuidv5 } from "uuid";

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

var db = firebase.firestore();

//Add shared id to firestore
export async function addSharedSearchToFirestore(searchValue) {
  //currently using the original search. Might be more efficient to use the cleaned search
  console.log(searchValue);
  const MY_NAMESPACE = "1b671a64-40d5-491e-99b0-da01ff1f3341";
  const id = uuidv5(searchValue[0].value, MY_NAMESPACE);
  const searchTerm = searchValue[0].value;
  console.log(id);
  const collection = db.collection("share").doc(id);
  await collection
    .set({
      searchTerm,
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });

  console.log("Document written with ID: ", id);
}

//Get search string from database based on id
export async function getSharedSearchToFirestore(id) {
  const docRef = db.collection("share").doc(id);
  const document = await docRef.get().catch(function (error) {
    console.log("Error getting document:", error);
  });

  if (document.exists) {
    console.log("Document data:", document.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}
