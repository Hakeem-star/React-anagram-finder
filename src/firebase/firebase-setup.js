// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
// Add the Firebase products that you want to use
import "firebase/firestore";
import "firebase/storage";
import { uuidv5Maker } from "./../utils/uuid-config";

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
export async function addSharedSearchToFirestore(searchValue, anagramType) {
  //currently using the original search. Might be more efficient to use the cleaned search
  const id = uuidv5Maker(searchValue[0].value);
  const searchTerm = searchValue[0].value;
  const collection = db.collection("share").doc(id);
  await collection
    .set({
      searchTerm,
      anagramType,
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
  const path = `${window.location.origin}${window.location.pathname}`;
  // console.log(`${path}?share=${id}`);
  return `${path}?share=${id}`;
}

//Get search string from database based on id
export async function getSharedSearchToFirestore(id) {
  const docRef = db.collection("share").doc(id);
  const document = await docRef.get().catch(function (error) {
    console.log("Error getting document:", error);
  });

  if (document.exists) {
    console.log("Document data:", document.data());
    const searchTermObject = await document.data();
    return searchTermObject;
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}
