import React, { useState, useEffect } from "react";
import { Layout, Row, Col } from "antd";

import "antd/dist/antd.less";
import "./App.less";
import StickySide from "./components/StickySide";
import PageHeader from "./components/PageHeader";
import SearchInput from "./components/SearchInput";
import ThresholdSlider from "./components/ThresholdSlider";
import ResultsTable from "./components/ResultsTable";

const { Content } = Layout;

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

  const [toggleCollapedSider, setToggleCollapedSider] = useState(true);

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
      <StickySide
        toggleCollapedSider={toggleCollapedSider}
        updateActiveHistoryButtonStatus={updateActiveHistoryButtonStatus}
        previousSearches={previousSearches}
        setToggleCollapedSider={setToggleCollapedSider}
      />
      <Row style={{ width: "100%" }}>
        <Col span={24}>
          <PageHeader />
          <SearchInput
            updateFetchingTableDataStatus={updateFetchingTableDataStatus}
            updateActiveHistoryButtonStatus={updateActiveHistoryButtonStatus}
            matchesPreviousSearch={matchesPreviousSearch}
            updateTableData={updateTableData}
            updatePreviousSearchesState={updatePreviousSearchesState}
            previousSearches={previousSearches}
          />

          <Content
            className="main-content"
            style={{ paddingTop: "60px", paddingBottom: "60px" }}
          >
            <Row justify="center">
              <Col style={{ textAlign: "left" }} span={16}>
                <p>Threshold</p>
              </Col>
            </Row>
            <Row justify="center">
              <Col span={16}>
                <ThresholdSlider
                  updateThresholdSliders={updateThresholdSliders}
                  updateFilteredTableData={updateFilteredTableData}
                  tableData={tableData}
                  thresholdSliders={thresholdSliders}
                />
              </Col>
            </Row>
            <Row justify="center">
              <Col span={20}>
                <ResultsTable
                  fetchingTableDataStatus={fetchingTableDataStatus}
                  filteredtableData={filteredtableData}
                />
              </Col>
            </Row>
          </Content>
        </Col>
      </Row>
    </Layout>
  );
}
