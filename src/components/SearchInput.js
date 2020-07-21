import React, { useContext, useEffect } from "react";
import { Input } from "antd";
import "./SearchInput.less";
import { SearchOutlined } from "@ant-design/icons";
import { AppContext } from "./../App";
import useURLSharedSearch from "../utils/useURLSharedSearch";
const { Search } = Input;

export default function SearchInput() {
  const { inputvalueState, setInputvalueState, sharedSearchInput } = useContext(
    AppContext
  );
  const search = useURLSharedSearch();

  useEffect(() => {
    if (sharedSearchInput !== null) {
      search(sharedSearchInput);
    }
  }, [sharedSearchInput, search]);

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
      // enterButton
      // suffix={<SearchOutlined className="search__suffix" />}
    />
  );
}
