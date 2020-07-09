import React from "react";
import { Input, message } from "antd";
import "./SearchInput.less";
import { SearchOutlined } from "@ant-design/icons";
import celebAnagramFinder from "../utils/celebAnagramFinderAPICall";
import fetchFromCelebApi from "../utils/fetchCelebData";

message.config({
  top: 24,
  duration: 1.5,
  maxCount: 1,
  rtl: true,
});

export default function SearchInput({
  updateFetchingTableDataStatus,
  updateActiveHistoryButtonStatus,
  matchesPreviousSearch,
  updateTableData,
  updatePreviousSearchesState,
  previousSearches,
}) {
  return (
    <Input
      className="search"
      placeholder="input anagram"
      size="37px"
      onPressEnter={(e) => {
        let searchValue = e.target.value;
        let previousSearchMatch = matchesPreviousSearch(
          previousSearches,
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
              updateTableData(anagramResult);
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
                updateTableData(anagramResult);
                const scrollOptions = {
                  behavior: "smooth",
                  block: "start",
                  inline: "nearest",
                };
                document.querySelector(".search").scrollIntoView(scrollOptions);
                //Update previous searches object array with search, time & result
                updatePreviousSearchesState((search) => {
                  //Make a copy and enforce a maximum of 10 previous searches
                  let result = search.slice(0, 9);
                  let time = new Date();
                  const trailingDots = searchValue.length > 7 ? "..." : "";
                  let name = `${searchValue.substr(0, 8)}${trailingDots}`;

                  result.unshift({
                    value: searchValue,
                    title: time.toGMTString(),
                    name,
                    tableData: anagramResult,
                  });

                  return result;
                });
              }
            })();
      }}
      suffix={<SearchOutlined className="search__suffix" />}
    />
  );
}
