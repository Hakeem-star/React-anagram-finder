import React, { useState, useEffect, Fragment } from "react";
import celebAnagramFinder from "./utils/celebAnagramFinderAPICall";
import {
  Layout,
  Menu,
  Input,
  Table,
  Row,
  Col,
  Slider,
  message,
  InputNumber,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PreviousSearches from "./components/loading/PreviousSearches";

import "antd/dist/antd.less";
import "./App.less";

const { Header, Content, Sider } = Layout;

message.config({
  top: 24,
  duration: 1.5,
  maxCount: 1,
  rtl: true,
});

const menuItemStyle = {
  width: "49%",
  textAlign: "center",
  height: "100%",
  lineHeight: "100px",
  fontSize: "37px",
};

const pageTitleStyle = {
  color: "white",
  fontSize: "23px",
  textAlign: "center",
  paddingTop: "37px",
  marginBottom: "60px",
};

const columns = [
  {
    title: "Anagram",
    dataIndex: "Anagram",
    key: "Anagram",
  },
  {
    title: "Name",
    dataIndex: "Name",
    key: "Name",
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
    defaultSortOrder: "descend",
    sorter: {
      compare: (a, b) => a["%"] - b["%"],
    },
    // onFilter: (value, record) => record.name.indexOf(value) === 0,
    // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => null,
  },
];

function formatter(value) {
  return `${value}%`;
}

const matchesPreviousSearch = (previousSearchesState, newSearch) => {
  //go through the previous searches and compare it to the new search
  for (let index = 0; index < previousSearchesState.length; index++) {
    if (previousSearchesState[index].value === newSearch) {
      //If a match is found, return the match status as well as the index it was found
      return { match: true, index };
    }
  }
  return { match: false, index: null };
};

const updateActiveHistoryButtonStatus = (matchesPreviousSearchResult) => {
  //get data from previous history
  //Remove class from other elements that already have the active class
  Array.from(document.querySelectorAll(`.previous-search__item`)).forEach(
    (element) => {
      element.classList.remove("--active");
    }
  );

  let element = document.querySelector(
    `.previous-search__item.result-${matchesPreviousSearchResult}`
  );

  //highlight previous history selection
  element.classList.add("--active");

  //update history search
};
export default function App() {
  const [tableData, updateTableData] = useState([]);
  const [filteredtableData, updateFilteredTableData] = useState([]);
  const [previousSearches, updatePreviousSearchesState] = useState([]); //[{value:tableData,title:Date.now()}]
  const [fetchingTableDataStatus, updateFetchingTableDataStatus] = useState(
    false
  );
  const [thresholdSliders, updateThresholdSliders] = useState([1, 100]);

  useEffect(() => {
    //Filter table data using current threshold values
    updateFilteredTableData(() => {
      return tableData.filter(
        (data) =>
          data["%"] >= thresholdSliders[0] && data["%"] <= thresholdSliders[1]
      );
    });
  }, [tableData, thresholdSliders]);

  useEffect(() => {
    //Highlight the most recent search button
    if (previousSearches.length !== 0) {
      updateActiveHistoryButtonStatus(0);
    }
  }, [previousSearches]);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={300} className="site-layout-background">
        <div style={pageTitleStyle}>Anagram Finder</div>
        <PreviousSearches
          activateHistory={updateActiveHistoryButtonStatus}
          results={previousSearches}
        ></PreviousSearches>
      </Sider>
      <Row style={{ width: "100%" }}>
        <Col span={24}>
          <Header style={{ padding: "0", height: "100px" }}>
            <Menu
              style={{ width: "100%", height: "100%", lineHeight: "0" }}
              mode="horizontal"
            >
              <Menu.Item style={menuItemStyle} key="General">
                General
              </Menu.Item>
              <li
                style={{
                  margin: "0",
                  height: "100%",
                  width: "2px",
                  display: "inline-block",
                }}
                className="custom-menu-divider"
              ></li>

              <Menu.Item style={menuItemStyle} key="Celebs">
                Celebs
              </Menu.Item>
            </Menu>
          </Header>
          <Input
            className="search"
            placeholder="input anagram"
            size="37px"
            style={{
              borderTop: 0,
              width: "100%",
              height: "100px",
              paddingLeft: "40px",
            }}
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
                    let input = await celebAnagramFinder(searchValue);
                    updateTableData(input);
                    updateFetchingTableDataStatus(false);
                  })()
                : (async () => {
                    //If it's a new search
                    updateFetchingTableDataStatus(true);
                    let input = await celebAnagramFinder(searchValue);
                    updateFetchingTableDataStatus(false);
                    if (input.length === 0) {
                      message.error("No results found");
                    } else {
                      updateTableData(input);
                      updatePreviousSearchesState((search) => {
                        //Make a copy and enforce a maximum of 10 previous searches
                        let result = search.slice(0, 9);
                        let time = new Date();
                        const trailingDots =
                          searchValue.length > 7 ? "..." : "";
                        let name = `${searchValue.substr(0, 8)}${trailingDots}`;
                        result.unshift({
                          value: searchValue,
                          title: time.toGMTString(),
                          name,
                        });
                        return result;
                      });
                    }
                  })();
            }}
            suffix={
              <SearchOutlined
                style={{
                  fontSize: "21px",
                  marginRight: "50px",
                }}
              />
            }
          />
          <Content style={{ paddingTop: "60px" }}>
            <Row justify="center">
              <Col style={{ textAlign: "left" }} span={16}>
                <p>Threshold</p>
              </Col>
            </Row>
            <Row justify="center">
              <Col span={16}>
                <InputNumber
                  min={1}
                  max={100}
                  value={thresholdSliders[0]}
                  onChange={(value) => {
                    updateThresholdSliders([value, thresholdSliders[1]]);
                    updateFilteredTableData(() => {
                      return tableData.filter(
                        (data) =>
                          data["%"] >= value && data["%"] <= thresholdSliders[1]
                      );
                    });
                  }}
                />
                <InputNumber
                  min={1}
                  max={100}
                  value={thresholdSliders[1]}
                  onChange={(value) => {
                    updateThresholdSliders([thresholdSliders[0], value]);
                    updateFilteredTableData(() => {
                      return tableData.filter(
                        (data) =>
                          data["%"] >= thresholdSliders[0] && data["%"] <= value
                      );
                    });
                  }}
                />
                <Slider
                  defaultValue={[1, 100]}
                  range
                  min={1}
                  className="threshold-slider"
                  value={thresholdSliders}
                  onChange={(value) => {
                    updateThresholdSliders(value);
                    updateFilteredTableData(() => {
                      return tableData.filter(
                        (data) => data["%"] >= value[0] && data["%"] <= value[1]
                      );
                    });
                  }}
                  tipFormatter={formatter}
                />
              </Col>
            </Row>
            <Row justify="center">
              <Col span={20}>
                <Table
                  loading={fetchingTableDataStatus}
                  dataSource={filteredtableData}
                  columns={columns}
                />
              </Col>
            </Row>
          </Content>
        </Col>
      </Row>
    </Layout>
  );
}
