import celebAPIResult_local from "../../CelebNames2.json";


function mapLocalData(data) {
  return data.map((celeb) => {
    return celeb.value;
  });
}

export default async function fetchFromCelebApi() {
  return mapLocalData(celebAPIResult_local);
}
