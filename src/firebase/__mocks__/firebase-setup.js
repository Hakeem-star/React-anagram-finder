import { uuidv5Maker } from "./../../utils/uuid-config";
export async function addSharedSearchToFirestore() {
  const id = uuidv5Maker("trump");
  return `www.celebAnagram.com/?share=${id}`;
}

export async function getSharedSearchToFirestore(id) {
  return "test";
}
