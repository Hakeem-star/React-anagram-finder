import celebAPIResult_local from "../celebAPIResult_local.json";
import { fileURLs } from "./../firebase/firebase-setup";

export function mapLocalData(data) {
  return data.CelebrityValues.map((celeb) => {
    return celeb.name;
  });
}

export default async function fetchFromCelebApi() {
  //Bypass CORS if needed. Replace fetch url with proxyUrl + targetUrl
  // const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  // const targetUrl = "https://celebritybucks.com/developers/export/JSON";

  // const targetUrl = await fileURLs.celebNames;

  // // Fetch the json of celebs
  // const resFetch = await fetch(targetUrl);

  // // convert result to JSON
  // const celebsFromApi = await resFetch.json();
  // // If it fails, log message and quit
  // if (resFetch.status !== 200) {
  //   console.log(
  //     "Looks like there was a problem. Status Code: " + resFetch.status
  //   );
  //   return;
  // }
  // console.log(celebsFromApi);

  // return mapLocalData(celebsFromApi);

  return mapLocalData(celebAPIResult_local);
}
