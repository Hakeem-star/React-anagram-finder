import React, { useContext, useState } from "react";
import { Input, message } from "antd";
import "./SearchInput.less";
import { SearchOutlined } from "@ant-design/icons";
import celebAnagramFinder from "../utils/celebAnagramFinderAPICall";
import fetchFromCelebApi from "../utils/fetchCelebData";
import { AppContext } from './../App';


message.config({
  top: 24,
  duration: 1.5,
  maxCount: 1,
  rtl: true,
});



export default function SearchInput() {

  const { updateFetchingTableDataStatus,
    updateActiveHistoryButtonStatus,
    matchesPreviousSearch,
    updateTableData,
    previousSearchHistory,
    updatePreviousSearchesStateData,
    previousSearchesData,
    inputvalueState,
    setInputvalueState } = useContext(AppContext);

  function pushToPrevSearchHistory(value) {
    updateTableData(() => {
      previousSearchHistory.current.unshift(value);
      // console.log(previousSearchHistory.current);
      return value;
    })
  }

  return (
    <Input
      className="search"
      placeholder="input anagram"
      size="37px"
      value={inputvalueState}
      onChange={(e) => {
        console.log(e.target.value);
        return setInputvalueState(() => e.target.value)
      }
      }
      onPressEnter={(e) => {
        let searchValue = e.target.value;
        let previousSearchMatch = matchesPreviousSearch(
          previousSearchesData,
          searchValue
        ); //{ match: false, index }
        //If the new user input is the same as a previous input
        previousSearchMatch.match
          ? //Update shown result to be previous value & highlight in history
          (async () => {
            updateActiveHistoryButtonStatus(previousSearchMatch.index);
            //update current table results
            updateFetchingTableDataStatus(true);
            let anagramResult = await celebAnagramFinder(
              searchValue,
              fetchFromCelebApi
            );
            pushToPrevSearchHistory(anagramResult);
            updateFetchingTableDataStatus(false);
          })()
          : (async () => {
            //If it's a new search
            updateFetchingTableDataStatus(true);
            let anagramResult = await celebAnagramFinder(
              searchValue,
              fetchFromCelebApi
            );
            updateFetchingTableDataStatus(false);
            if (anagramResult.length === 0) {
              message.error("No results found");
            } else {
              //Scroll to input on top
              pushToPrevSearchHistory(anagramResult);
              const scrollOptions = {
                behavior: "smooth",
                block: "start",
                inline: "nearest",
              };
              document.querySelector(".search").scrollIntoView(scrollOptions);
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
      }}
      suffix={< SearchOutlined className="search__suffix" />}
    />
  );
}

