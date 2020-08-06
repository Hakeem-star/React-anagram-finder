import React, { useContext, useEffect, useRef } from "react";
import { Input } from "antd";
import "./SearchInput.less";
import { AppContext } from "./../App";
import useURLSharedSearch from "../utils/useURLSharedSearch";
const { Search } = Input;

export default function SearchInput() {
  const {
    inputvalueState,
    setInputvalueState,
    sharedSearchInput,
    fetchingTableDataStatus,
  } = useContext(AppContext);
  const search = useURLSharedSearch();
  const preventInitialRun = useRef(false);

  useEffect(() => {
    if (sharedSearchInput !== null) {
      search(sharedSearchInput);
    }
  }, [sharedSearchInput]);

  useEffect(() => {
    //Scroll to input on top
    // pushToPrevSearchHistory(anagramResult);
    const scrollOptions = {
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    };

    if (!fetchingTableDataStatus && preventInitialRun.current) {
      document.querySelector(".search").scrollIntoView(scrollOptions);
    }
  }, [fetchingTableDataStatus]);
  preventInitialRun.current = true;

  return (
    <Search
      className="search"
      placeholder="input anagram"
      size="37px"
      value={inputvalueState}
      onChange={(e) => {
        return setInputvalueState(() => e.target.value);
      }}
      onSearch={search}
    />
  );
}
