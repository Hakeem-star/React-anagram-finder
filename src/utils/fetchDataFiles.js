//uncomment for local testing
// import celebAPIResult_local from "../localData/celebs_06082020.json";
// import words_local from "../localData/words_06082020.json";
import { listAllFromStorage, assignFileURLs } from "../firebase/firebase-setup";
import { set, get, keys, del } from "idb-keyval";
// const localTestEnv = false;

export default async function fetchDataFiles(anagramType) {
  let JSONResponse;
  //Fetching data

  //uncomment for local testing
  // if (localTestEnv) {
  //   if (anagramType === "celebs") {
  //     return celebAPIResult_local.name;
  //   }
  //   if (anagramType === "words") {
  //     return words_local.name;
  //   }
  // }
  // console.log(typeof anagramType);
  let targetUrl;

  const fileURLs = await assignFileURLs();
  //Decide which anagram data to use
  if (anagramType === "celebs") {
    targetUrl = await fileURLs.celebNames;
  }
  if (anagramType === "words") {
    targetUrl = await fileURLs.words;
  }
  //Check if the data exists in indexdb to save another fetch

  //First check if the DB has the most recent file from firebase
  const filesFromFirebase = await listAllFromStorage();
  const firebaseFileNameRef = filesFromFirebase.find((ref) => {
    return ref.name.includes(anagramType);
  });

  if (firebaseFileNameRef === undefined) {
    console.error("No relevent file found on server. Please contact admin");
  }
  const firebaseFileName = firebaseFileNameRef.name;

  const arrayOfDBKeys = await keys();
  const hasMostRecentFile = arrayOfDBKeys.indexOf(firebaseFileName);
  //if the file is in the local db
  if (hasMostRecentFile !== -1) {
    //Get the file from DB
    const checkStorage = await get(firebaseFileName);

    if (checkStorage !== undefined) {
      JSONResponse = checkStorage;
    }
  } else {
    // Fetch the json of celebs from firebase
    const resFetch = await fetch(targetUrl);

    // convert result to JSON
    JSONResponse = await resFetch.json();
    //delete old file from db
    del(
      arrayOfDBKeys[
        arrayOfDBKeys.findIndex((value) => value.includes(anagramType))
      ]
    );

    // If it fails, log message and quit
    if (resFetch.status !== 200) {
      //Data stopped fetching

      console.error(
        "Looks like there was a problem. Status Code: " + resFetch.status
      );
      return;
    }
    //add to storage to save on future calls
    set(firebaseFileName, JSONResponse);
  }
  //Data stopped fetching
  return JSONResponse.name;

  // return words_local;
}
