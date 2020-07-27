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
    const historyButtonsIndex = previousSearchesState.length - index - 1;
    //Check which type of search it was
    console.log(previousSearchesState[index].anagramType, anagramType);
    if (previousSearchesState[index].anagramType === anagramType) {
      if (
        previousSearchesState[index].value.toLowerCase() ===
        newSearch.toLowerCase()
      ) {
        if (previousSearchesState[index].tableData === undefined) {
          return { match: true, historyButtonsIndex, index, overwrite: true };
        }

        //If a match is found, return the match status as well as the index it was found
        return { match: true, historyButtonsIndex, index, overwrite: false };
      }
    }
  }
  return { match: false, index: null };
};

export default function useURLSharedSearch() {
  const {
    setFetchingTableDataStatus,
    updateActiveHistoryButtonStatus,
    setPreviousSearchesData,
    previousSearchesData,
    setTableData,
    anagramType,
    setAnagramType,
    setCurrentSearch,
  } = useContext(AppContext);

  return (e, historyAnagramType) => {
    let searchValue;
    //historyAnagramType might come in as an object if it's called from the searchInput
    typeof historyAnagramType === "object" && (historyAnagramType = undefined);
    //If historyAnagramType is not undefined, change the global anagramType to match that (might be better to reassign the value)
    // historyAnagramType !== undefined && setAnagramType(historyAnagramType);

    if (typeof e === "string") {
      //If no value was entered
      if (e.length < 1) {
        message.error("Please type in an anagram");
        return;
      } else searchValue = e;
    } else {
      //if E was not a string, it must have come from the History button
      searchValue = e.target.value;
    }
    //If historyAnagramType has a value, use that as it's come from the button, else use global anagramType
    const localAnagramType = historyAnagramType || anagramType;
    //Update the global scope and header categories
    setAnagramType(localAnagramType);

    console.log(historyAnagramType, historyAnagramType || anagramType);
    let previousSearchMatch = matchesPreviousSearch(
      previousSearchesData,
      searchValue,
      localAnagramType
    ); //{ match: true, historyButtonsIndex: 1, index: 0, overwrite: false }

    //If the new user input is the same as a previous input and it does not need to be overwritten
    previousSearchMatch.match && !previousSearchMatch.overwrite
      ? //Update shown result to be previous value & highlight in history
        (() => {
          updateActiveHistoryButtonStatus(
            previousSearchMatch.historyButtonsIndex
          );
          //update current table results
          setTableData(() => {
            return previousSearchesData[previousSearchMatch.index].tableData;
          });

          setCurrentSearch(previousSearchesData[previousSearchMatch.index]);
        })()
      : (async () => {
          //If it's a new search
          setFetchingTableDataStatus(true);

          let anagramResult = await celebAnagramFinder(
            searchValue,
            //If historyAnagramType has a value(a historical search was clicked), use that, else use the global anagramType value
            localAnagramType
          );
          if (anagramResult.length === 0) {
            message.error("No results found");
          } else {
            setCurrentSearch(previousSearchesData[previousSearchMatch.index]);
            //If it needs to be overwritten, find the index and just give it table data
            if (previousSearchMatch.overwrite) {
              setPreviousSearchesData((search) => {
                let result = search.slice();
                result[previousSearchMatch.index].tableData = anagramResult;
                return result;
              });
              setTableData(() => {
                // console.log(previousSearchesData, previousSearchMatch.index);

                return previousSearchesData[previousSearchMatch.index]
                  .tableData;
              });

              updateActiveHistoryButtonStatus(
                previousSearchMatch.historyButtonsIndex
              );
            } else {
              //Update previous searches object array with search, time & result
              setPreviousSearchesData((search) => {
                //Make a copy and enforce a maximum of 10 previous searches
                let result = search.slice(0, 9);
                let time = new Date();
                result.unshift({
                  value: searchValue,
                  title: time.toGMTString(),
                  tableData: anagramResult,
                  anagramType: localAnagramType,
                });

                return result;
              });

              updateActiveHistoryButtonStatus(previousSearchesData.length);
            }
          }
        })();
  };
}
