import { useContext } from "react";
import { AppContext } from "./../App";
import { addSharedSearchToFirestore } from "../firebase/firebase-setup";

import { message } from "antd";
import { openNotification } from "./../components/SharedResultDisplay";

export function useShareSearch() {
  const { currentSearch, anagramType } = useContext(AppContext);

  return async (buttonSearch, ButtonAnagramType) => {
    const valueToUse = buttonSearch || currentSearch;
    const anagramTypeToUse = ButtonAnagramType || anagramType;
    console.log(valueToUse, buttonSearch, currentSearch);
    //generateUUID & send to firebase
    if (currentSearch) {
      const shareURL = await addSharedSearchToFirestore(
        valueToUse,
        anagramTypeToUse
      );
      //recieve confirmation that entry was added
      openNotification(shareURL);
      //Display something showing the url as well as icon to copy
    } else {
      message.error("Search for an anagram first");
    }
  };
}
