import { useContext } from "react";
import { AppContext } from "../App";
import celebAnagramFinder from "./celebAnagramFinderAPICall";
import { message } from "antd";

message.config({
  top: 24,
  duration: 1.5,
  maxCount: 1,
  rtl: true,
});

const matchesPreviousSearch = (
  previousSearchesState,
  newSearch,
  anagramType
) => {
  //go through the previous searches and compare it to the new search
  for (let index = 0; index < previousSearchesState.length; index++) {
    const correctIndex = previousSearchesState.length - index - 1;
    //Check which type of search it was
    if (previousSearchesState[index].anagramType === anagramType) {
      if (previousSearchesState[index].value === newSearch) {
        if (previousSearchesState[index].tableData === undefined) {
          return { match: true, index: correctIndex, overwrite: true };
        }

        //If a match is found, return the match status as well as the index it was found
        return { match: true, index: correctIndex, overwrite: false };
      }
    }
  }
  return { match: false, index: null };
};

export default function useURLSharedSearch() {
  const {
    updateFetchingTableDataStatus,
    updateActiveHistoryButtonStatus,
    updatePreviousSearchesStateData,
    previousSearchesData,
    updateTableData,
    anagramType,
  } = useContext(AppContext);

  return (e) => {
    let searchValue;
    if (typeof e === "string") {
      //If no value was entered
      if (e.length < 1) {
        message.error("Please type in an anagram");
        return;
      } else searchValue = e;
    } else {
      searchValue = e.target.value;
    }
    let previousSearchMatch = matchesPreviousSearch(
      previousSearchesData,
      searchValue,
      anagramType
    ); //{ match: false, index }
    //If the new user input is the same as a previous input
    previousSearchMatch.match && !previousSearchMatch.overwrite
      ? //Update shown result to be previous value & highlight in history
        (() => {
          updateActiveHistoryButtonStatus(previousSearchMatch.index);
          //update current table results
          updateTableData(() => {
            return previousSearchesData[previousSearchMatch.index].tableData;
          });
        })()
      : (async () => {
          //If it's a new search

          updateFetchingTableDataStatus(true);
          let anagramResult = await celebAnagramFinder(
            searchValue,
            anagramType
          );

          if (anagramResult.length === 0) {
            message.error("No results found");
          } else {
            //If it needs to be overwritten, find the index and just give it table data
            if (previousSearchMatch.overwrite) {
              updatePreviousSearchesStateData((search) => {
                let result = search.slice();
                result[previousSearchMatch.index].tableData = anagramResult;
                return result;
              });
            } else {
              //Update previous searches object array with search, time & result
              updatePreviousSearchesStateData((search) => {
                //Make a copy and enforce a maximum of 10 previous searches
                let result = search.slice(0, 9);
                let time = new Date();

                result.unshift({
                  value: searchValue,
                  title: time.toGMTString(),
                  tableData: anagramResult,
                  anagramType,
                });

                return result;
              });
            }
          }
        })();
  };
}
