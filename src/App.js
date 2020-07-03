import React, { useState, useEffect, Fragment } from "react";
import celebAnagramFinder from "./celebAnagramFinderAPICall";
import {
  Layout,
  Menu,
  Input,
  Divider,
  Table,
  Row,
  Col,
  Slider,
  message,
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
  rtl: false,
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
  },

  {
    title: "%",
    dataIndex: "%",
    key: "%",
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
};
export default function App() {
  const [tableData, updateTableData] = useState([]);
  const [previousSearches, updatePreviousSearchesState] = useState([]); //[{value:tableData,title:Date.now()}]
  const [fetchingTableDataStatus, updateFetchingTableDataStatus] = useState(
    false
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={300} className="site-layout-background">
        <div style={pageTitleStyle}>Anagram Finder</div>
        <PreviousSearches results={previousSearches}></PreviousSearches>
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
                    updateFetchingTableDataStatus(true);
                    let input = await celebAnagramFinder(searchValue);
                    updateFetchingTableDataStatus(false);
                    if (input.length === 0) {
                      message.error("No reults found");
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
            <Row justify="left">
              <Col offset={2} span={20}>
                <div>Results</div>
              </Col>
            </Row>
            <Row justify="center">
              <Col span={16}>
                <Slider
                  defaultValue={[1, 100]}
                  range
                  min={1}
                  className="threshold-slider"
                  tooltipVisible={true}
                  tipFormatter={formatter}
                />
              </Col>
            </Row>
            <Row justify="center">
              <Col span={20}>
                <Table
                  loading={fetchingTableDataStatus}
                  dataSource={tableData}
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
