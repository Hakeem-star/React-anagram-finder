import { useContext } from "react";
import { AppContext } from "../App";
import celebAnagramFinder from "./celebAnagramFinderAPICall";
import fetchFromCelebApi from "./fetchCelebData";
import { message } from "antd";

message.config({
  top: 24,
  duration: 1.5,
  maxCount: 1,
  rtl: true,
});

const matchesPreviousSearch = (previousSearchesState, newSearch) => {
  //go through the previous searches and compare it to the new search
  for (let index = 0; index < previousSearchesState.length; index++) {
    const correctIndex = previousSearchesState.length - index - 1;
    if (previousSearchesState[index].value === newSearch) {
      //If a match is found, return the match status as well as the index it was found
      return { match: true, index: correctIndex };
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
  } = useContext(AppContext);

  return (e) => {
    let searchValue = typeof e === "string" ? e : e.target.value;
    let previousSearchMatch = matchesPreviousSearch(
      previousSearchesData,
      searchValue
    ); //{ match: false, index }
    //If the new user input is the same as a previous input
    previousSearchMatch.match
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
            fetchFromCelebApi
          );

          if (anagramResult.length === 0) {
            message.error("No results found");
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
              });

              return result;
            });
          }
        })();
  };
}
