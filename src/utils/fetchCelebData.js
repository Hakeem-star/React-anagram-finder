import celebAPIResult_local from "../celebNames.json";
import words_local from "../words2.json";
import { fileURLs } from "./../firebase/firebase-setup";
import { set, get } from "idb-keyval";

export default async function fetchFromApi(anagramType) {
  // console.log(typeof anagramType);
  let targetUrl;
  let JSONResponse;
  //Decide which anagram data to use
  if (anagramType === "celebs") {
    targetUrl = await fileURLs.celebNames;
  }
  if (anagramType === "words") {
    targetUrl = await fileURLs.words;
  }
  //Check if the data exists in indexdb to save another fetch
  const checkStorage = await get(anagramType);
  if (checkStorage !== undefined) {
    JSONResponse = checkStorage;
  } else {
    // Fetch the json of celebs
    const resFetch = await fetch(targetUrl);

    // convert result to JSON
    JSONResponse = await resFetch.json();
    // If it fails, log message and quit
    if (resFetch.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + resFetch.status
      );
      return;
    }

    //add to storage to save on calls
    set(anagramType, JSONResponse);
  }

  return JSONResponse.name;

  // return words_local;
}
