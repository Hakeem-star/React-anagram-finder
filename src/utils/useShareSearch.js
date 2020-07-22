import { useContext } from "react";
import { AppContext } from "./../App";
import { addSharedSearchToFirestore } from "../firebase/firebase-setup";

import { message } from "antd";
import { openNotification } from "./../components/SharedResultDisplay";

export function useShareSearch() {
  const { previousSearchesData, anagramType } = useContext(AppContext);

  return async () => {
    //generateUUID & send to firebase
    if (previousSearchesData.length > 0) {
      const shareURL = await addSharedSearchToFirestore(
        previousSearchesData,
        anagramType
      );
      //recieve confirmation that entry was added
      openNotification(shareURL);
      //Display something showing the url as well as icon to copy
    } else {
      message.error("Search for an anagram first");
    }
  };
}
