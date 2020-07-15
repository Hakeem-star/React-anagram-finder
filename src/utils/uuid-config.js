import { v5 as uuidv5 } from "uuid";

const MY_NAMESPACE = "1b671a64-40d5-491e-99b0-da01ff1f3341";

export function uuidv5Maker(value) {
    return uuidv5(value, MY_NAMESPACE);
}