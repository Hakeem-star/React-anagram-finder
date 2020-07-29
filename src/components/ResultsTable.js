import React, { useEffect, useState, useRef, useContext } from "react";
import { Table, Input, Button, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { AppContext } from "./../App";

const columns = (anagramType) => [
  {
    title: "Anagram",
    dataIndex: "Anagram",
    key: "Anagram",
    // filters: [{ text: "", value: "" }],
    onFilter: (value, record) => {
      // console.log(value, record);
      return record.Anagram.indexOf(value) === 0;
    },
  },
  {
    title: anagramType === "celebs" ? "Name" : "Word",
    dataIndex: anagramType === "celebs" ? "Name" : "Word",
    key: anagramType === "celebs" ? "Name" : "Word",
    width: 900,
    // filters: [{ text: "", value: "" }],
    sorter: {
      compare: (a, b) => {
        const nameA = a.Name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.Name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      },
    },
  },
  {
    title: "%",
    dataIndex: "%",
    key: "%",
    width: 150,
    defaultSortOrder: "descend",
    sorter: {
      compare: (a, b) => a["%"] - b["%"],
    },
    // onFilter: (value, record) => record.name.indexOf(value) === 0,
    // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => null,
  },
];
export default function ResultsTable({
  fetchingTableDataStatus,
  filteredtableData,
  previousSearchesData,
}) {
  const { anagramType } = useContext(AppContext);

  const [columnsState, setColumns] = useState();
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const filterInput = useRef(null);
  const filterInputConfig = useRef(null);

  useEffect(() => {
    //Reset filters when a new search is made
    setSearchText("");
  }, [previousSearchesData]);

  useEffect(() => {
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      // console.log(dataIndex, selectedKeys);
      setSearchedColumn(dataIndex);
      setSearchText(selectedKeys[0]);
    };

    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText("");
    };

    filterInputConfig.current = (dataIndex) => {
      return {
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={filterInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
              }
              style={{ width: 188, marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => handleReset(clearFilters)}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            ? record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase())
            : "",
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => filterInput.current.select());
          }
        },
        render: (text) => {
          return searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          ) : (
            text
          );
        },
      };
    };

    const anamgramArray = [];

    filteredtableData.forEach((value) => {
      const test = anamgramArray.some(
        (element) => element.text === value.Anagram
      );
      if (!test) {
        anamgramArray.push({
          text: value.Anagram,
          value: value.Anagram,
        });
      }
    });

    setColumns(() => {
      const temp = columns(anagramType).slice();
      temp[0].filters = anamgramArray;
      // console.log(temp[0].filters);
      const celbeNames = filterInputConfig.current("Name");
      Object.assign(temp[1], celbeNames);
      return temp;
    });
  }, [filteredtableData, anagramType, searchedColumn, searchText]);

  return (
    <Table
      loading={{ spinning: fetchingTableDataStatus }}
      dataSource={filteredtableData}
      columns={columnsState}
    />
  );
}
