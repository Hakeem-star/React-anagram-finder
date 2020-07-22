import React, { useState, useEffect, Fragment, useRef } from "react";
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
import { createLocalData, getLocalData } from "./utils/indexDBManager";
import fetchFromApi from "./utils/fetchCelebData";
import LoginPage from "./LoginPage";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import RegisterPage from "./RegisterPage";

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
  const preventInitialRun = useRef(false);
  //On mount grab shared results from url uuid in search query
  useEffect(() => {
    const id = getURLSharedId();
    //get the search term of the id from firebase
    if (id !== null) {
      (async () => {
        const searchTerm = await getSharedSearchToFirestore(id);
        //set the context for the search
        setAnagramType(searchTerm.anagramType);

        //Perform a search and update the input & history
        setSharedSearchInput(searchTerm.searchTerm);
      })();
    }

    return function cleanup() {
      preventInitialRun.current = false;
    };
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

  // useEffect(() => {
  //   //Scroll to input on top
  //   // pushToPrevSearchHistory(anagramResult);
  //   const scrollOptions = {
  //     behavior: "smooth",
  //     block: "start",
  //     inline: "nearest",
  //   };
  //   console.log(preventInitialRun.current);

  //   if (!fetchingTableDataStatus && preventInitialRun.current) {
  //     document.querySelector(".search").scrollIntoView(scrollOptions);
  //   }
  // }, [fetchingTableDataStatus]);

  useEffect(() => {
    //When the previous state is updated by performing a new search, update the table data
    //This provides a sensible way to update everything at once
    //Highlight the most recent search button
    if (previousSearchesData.length > 0) {
      updateTableData(() => previousSearchesData[0].tableData);
    }
  }, [previousSearchesData]);

  preventInitialRun.current = true;
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <AppContext.Provider
          value={{
            anagramType,
            inputvalueState,
            sharedSearchInput,
            toggleCollapedSider,
            previousSearchesData,
            fetchingTableDataStatus,
            setAnagramType,
            setInputvalueState,
            updateActiveHistoryButtonStatus,
            setToggleCollapedSider,
            updateTableData,
            updateFetchingTableDataStatus,
            updatePreviousSearchesStateData,
          }}
        >
          <Route exact path="/">
            <StickySide />
          </Route>
          <Row style={{ width: "100%", height: "100vh" }}>
            <Col span={24}>
              <PageHeader
                anagramType={anagramType}
                setAnagramType={setAnagramType}
              />
              <Route exact path="/logIn">
                <LoginPage />
              </Route>
              <Route exact path="/register">
                <RegisterPage />
              </Route>
              {/*Main page*/}
              <Route exact path="/">
                <>
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
                          previousSearchesData={previousSearchesData}
                        />
                      </Col>
                    </Row>
                  </Content>
                </>
              </Route>
            </Col>
          </Row>
        </AppContext.Provider>
      </Layout>
    </Router>
  );
}
