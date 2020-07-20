import celebAPIResult_local from "../../CelebNames2.json";
import words_local from "../../words2.json";

export default async function fetchFromCelebApi(anagramType) {
  console.log(anagramType);
  let targetUrl;

  if (anagramType === "celebs") {
    targetUrl = celebAPIResult_local;
  }

  if (anagramType === "general") {
    targetUrl = words_local;
  }

  return targetUrl;
}
