import React, { useState, useEffect } from "react";
import { Layout, Row, Col } from "antd";

import "antd/dist/antd.less";
import "./App.less";
import StickySide from "./components/StickySide";
import PageHeader from "./components/PageHeader";
import SearchInput from "./components/SearchInput";
import ThresholdSlider from "./components/ThresholdSlider";
import ResultsTable from "./components/ResultsTable";
import { getSharedSearchToFirestore } from "./firebase/firebase-setup";
import { getURLSharedId } from "./utils/getURLSharedId";

export const AppContext = React.createContext();

const { Content } = Layout;

const updateActiveHistoryButtonStatus = (matchesPreviousSearchResult) => {
  //get data from previous history
  //Remove class from other elements that already have the active class
  Array.from(document.querySelectorAll(`.previous-searches__item`)).forEach(
    (element) => {
      element.classList.remove("--active");
    }
  );

  let element = document.querySelector(
    `.previous-searches__item.result-${matchesPreviousSearchResult}`
  );

  //highlight previous history selection
  element.classList.add("--active");

  //update history search
};

export default function App() {
  const [anagramType, setAnagramType] = useState("celebs");
  const [tableData, updateTableData] = useState([]);
  const [filteredtableData, updateFilteredTableData] = useState([]);
  const [previousSearchesData, updatePreviousSearchesStateData] = useState([]); //[{value:"test",tableData:[{}],title:Date.now()}]
  const [fetchingTableDataStatus, updateFetchingTableDataStatus] = useState(
    false
  );
  const [thresholdSliders, updateThresholdSliders] = useState([1, 100]);

  const [toggleCollapedSider, setToggleCollapedSider] = useState(true);
  const [inputvalueState, setInputvalueState] = useState("");
  const [sharedSearchInput, setSharedSearchInput] = useState(null);

  //On mount grab shared results from url uuid in search query
  useEffect(() => {
    const id = getURLSharedId();
    //get the search term of the id from firebase
    if (id !== null) {
      (async () => {
        const searchTerm = await getSharedSearchToFirestore(id);
        // console.log(id, searchTerm);
        //Perform a search and update the input & history
        setSharedSearchInput(searchTerm);
      })();
    }

    //Update table as if a request was made
  }, []);

  useEffect(() => {
    //Confirm completed load after table is filtered
    if (filteredtableData.length > 0) updateFetchingTableDataStatus(false);
  }, [filteredtableData]);

  useEffect(() => {
    //Filter table data using current threshold values

    updateFilteredTableData(() => {
      return tableData.filter(
        (data) =>
          data["%"] >= thresholdSliders[0] && data["%"] <= thresholdSliders[1]
      );
    });
    //thresholdSliders dependancy is excluded because this is already managed in its own state and another state that triggers this effect
  }, [tableData]);

  useEffect(() => {
    //Scroll to input on top
    // pushToPrevSearchHistory(anagramResult);
    const scrollOptions = {
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    };
    if (!fetchingTableDataStatus) {
      document.querySelector(".search").scrollIntoView(scrollOptions);
    }
  }, [fetchingTableDataStatus]);

  useEffect(() => {
    //When the previous state is updated by performing a new search, update the table data
    //This provides a sensible way to update everything at once
    //Highlight the most recent search button
    if (previousSearchesData.length > 0) {
      updateTableData(() => previousSearchesData[0].tableData);
    }
  }, [previousSearchesData]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppContext.Provider
        value={{
          anagramType,
          inputvalueState,
          sharedSearchInput,
          toggleCollapedSider,
          previousSearchesData,
          setInputvalueState,
          updateActiveHistoryButtonStatus,
          setToggleCollapedSider,
          updateTableData,
          updateFetchingTableDataStatus,
          updatePreviousSearchesStateData,
        }}
      >
        <StickySide />
        <Row style={{ width: "100%" }}>
          <Col span={24}>
            <PageHeader setAnagramType={setAnagramType} />
            <Row justify="center">
              <SearchInput />
            </Row>
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
      </AppContext.Provider>
    </Layout>
  );
}
