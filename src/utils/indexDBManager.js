import { set, get } from "idb-keyval";

export async function createLocalData(key, data) {
  return set(key, data)
    .then(() => {
      console.log("it worked");
    })
    .catch((err) => console.log("It failed!", err));
}

export function getLocalData(key) {
  get(key).then((val) => console.log(val));
}
