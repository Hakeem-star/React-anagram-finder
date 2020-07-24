import { uuidv5Maker } from "./../../utils/uuid-config";
export async function addSharedSearchToFirestore() {
  const id = uuidv5Maker("trump");
  return `www.celebAnagram.com/?share=${id}`;
}

export async function getSharedSearchToFirestore(id) {
  return Promise.resolve({ anagramType: "celebs", searchTerm: "test" });
}

const firebaseUser = null;
export function authChange(logInState, user, updatePreviousData) {
  if (firebaseUser) {
    logInState(true);
    user(user);
    updatePreviousData();
  } else {
    logInState(false);
  }
}
