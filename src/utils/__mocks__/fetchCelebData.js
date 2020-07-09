import celebAPIResult_local from "../../celebAPIResult_local.json";

function mapLocalData(data) {
  return data.CelebrityValues.map((celeb) => {
    return celeb.name;
  });
}

export default async function fetchFromCelebApi() {
  return mapLocalData(celebAPIResult_local);
}
