import celebAPIResult_local from "../celebNames.json";
import words_local from "../words2.json";
import { fileURLs } from "./../firebase/firebase-setup";

export default async function fetchFromApi(anagramType) {
  let targetUrl;
  //Decide which anagram data to use
  if (anagramType === "celebs") {
    targetUrl = await fileURLs.celebNames;
  }
  if (anagramType === "general") {
    targetUrl = await fileURLs.words;
  }

  // Fetch the json of celebs
  const resFetch = await fetch(targetUrl);

  // convert result to JSON
  const JSONResponse = await resFetch.json();
  // If it fails, log message and quit
  if (resFetch.status !== 200) {
    console.log(
      "Looks like there was a problem. Status Code: " + resFetch.status
    );
    return;
  }
  return JSONResponse.name;

  // return words_local;
}
