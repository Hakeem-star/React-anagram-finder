// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { uuidv5Maker } from "./../utils/uuid-config";

firebase.initializeApp(firebaseConfig);

//////////
//Storage
/////////

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = firebase.storage();

// Create a storage reference from our storage service
const storageRef = storage.ref();
let celebnames, words;

export async function assignFileURLs() {
  const storage = await listAllFromStorage();

  storage.forEach((value) => {
    if (value.name.includes("celebs")) {
      celebnames = storageRef.child(value.name);
    }
    if (value.name.includes("words")) {
      words = storageRef.child(value.name);
    }
  });
  try {
    return {
      celebNames: celebnames.getDownloadURL(),
      words: words.getDownloadURL(),
    };
  } catch (err) {
    console.error(err, "Check file names on firebase");
  }
}

// export const fileURLs = assignFileURLs();

export async function listAllFromStorage() {
  let ret = await storageRef.listAll().catch(function (error) {
    console.error("Error adding document: ", error);
  });
  return ret.items;
}
////////////
///FireStore
////////////

var db = firebase.firestore();

//Add shared id to firestore
export async function addSharedSearchToFirestore(searchValue, anagramType) {
  //currently using the original search. Might be more efficient to use the cleaned search
  const id = uuidv5Maker(searchValue);
  const searchTerm = searchValue;
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
    console.error("Error getting document:", error);
  });

  if (document.exists) {
    const searchTermObject = await document.data();
    return searchTermObject;
  } else {
    // doc.data() will be undefined in this case
    console.error("No such document!");
  }
}

async function getPreviousDataFromFirestore(email) {
  const docRef = db.collection("user").doc(email);
  const document = await docRef.get().catch(function (error) {
    console.error("Error getting document:", error);
  });

  if (document.exists) {
    // console.log("Document data:", document.data());
    const previousDataObject = await document.data();
    // console.log(previousDataObject);
    return previousDataObject;
  } else {
    // doc.data() will be undefined in this case
    console.error("No such document!");
  }
}

export async function setPreviousDataToFirestore(email, previousSearchesData) {
  const collection = db.collection("user").doc(email);
  const previousData = JSON.stringify(previousSearchesData);

  await collection
    .set({
      previousSearchesData: previousData,
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}
///////////////////
// Auth
///////////////////
const auth = firebase.auth();

export function signInWithEmailPass({ email, password }) {
  const request = auth.signInWithEmailAndPassword(email, password);
  request.catch((e) => console.error(e.message));
  return request;
}

export async function createUserWithEmailPass(
  { email, password },
  previousSearchesData
) {
  try {
    await auth.createUserWithEmailAndPassword(email, password);

    //once an account has been created, add a document in firestore
    const collection = db.collection("user").doc(email);
    const previousData = JSON.stringify(previousSearchesData);
    await collection
      .set({
        previousSearchesData: previousData,
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  } catch (e) {
    console.error(e.message);
  }
}

export function authChange(logInState, user, updatePreviousData) {
  auth.onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
      // console.log(firebaseUser);
      //Logged in
      user(firebaseUser);
      logInState(true);
      //Get the users previous data from storage
      const previousData = await getPreviousDataFromFirestore(
        firebaseUser.email
      );
      //Use it to update state
      if (previousData) {
        updatePreviousData(JSON.parse(previousData.previousSearchesData));
      }
    } else {
      // console.log("Not logged in");
      logInState(false);
      updatePreviousData([]);
      //Logged out
    }
  }); //out = null
}
export function signOut() {
  const request = firebase.auth().signOut();
  return request;
}
