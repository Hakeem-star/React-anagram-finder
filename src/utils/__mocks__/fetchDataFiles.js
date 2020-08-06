import celebAPIResult_local from "./mockData/CelebNames2.json";
import words_local from "./mockData/words2.json";

export default async function fetchDataFiles(anagramType) {
  let targetUrl;

  if (anagramType === "celebs") {
    targetUrl = celebAPIResult_local;
  }

  if (anagramType === "words") {
    targetUrl = words_local;
  }

  return targetUrl;
}
