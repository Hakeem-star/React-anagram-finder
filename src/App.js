import React, { useState, useEffect, Fragment, useRef } from "react";
import { Layout, Row, Col } from "antd";

import "antd/dist/antd.less";
import "./App.less";
import StickySide from "./components/StickySide";
import PageHeader from "./components/PageHeader";
import SearchInput from "./components/SearchInput";
import ThresholdSlider from "./components/ThresholdSlider";
import ResultsTable from "./components/ResultsTable";
import {
  getSharedSearchToFirestore,
  authChange,
  setPreviousDataToFirestore,
} from "./firebase/firebase-setup";
import { getURLSharedId } from "./utils/getURLSharedId";
import { createLocalData, getLocalData } from "./utils/indexDBManager";
import fetchFromApi from "./utils/fetchCelebData";

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
  //Logged in state
  const [loggedIn, setLoggedIn] = useState(false);
  //User info
  const [user, setUser] = useState(false);
  const [anagramType, setAnagramType] = useState("celebs"); //celebs|words
  //Raw data for the table
  const [tableData, setTableData] = useState([]);
  //Control the previous searches so we get a result when we switch between anagram Types
  const [previousTableData, setPreviousTableData] = useState({
    celebs: [],
    words: [],
  });
  //Filtered table data created by thresholds
  const [filteredtableData, setFilteredTableData] = useState([]);
  //Holds the last search that was made
  const [previousSearchesData, setPreviousSearchesData] = useState([]); //[{value:"test",tableData:[{}],title:Date.now()}]
  //Holds the current search value
  const [currentSearch, setCurrentSearch] = useState(null);
  //Status of the results table populating
  const [fetchingTableDataStatus, setFetchingTableDataStatus] = useState(false);
  //Values of the threshold sliders
  const [thresholdSliders, setThresholdSliders] = useState([1, 100]);
  //State of the history side bar
  const [toggleCollapedSider, setToggleCollapedSider] = useState(true);
  //Search Inputs value
  const [inputvalueState, setInputvalueState] = useState("");
  //
  const [sharedSearchInput, setSharedSearchInput] = useState(null);
  //Ref to prevent calculating values before first mount
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
    //signin Check
    authChange(setLoggedIn, setUser, setPreviousSearchesData);
  }, []);

  useEffect(() => {
    //Download data files
    authChange(setLoggedIn, setUser, setPreviousSearchesData);
  }, []);

  useEffect(() => {
    //If current search changes, clear previous data
    setPreviousTableData({
      celebs: [],
      words: [],
    });
  }, [currentSearch]);

  useEffect(() => {
    //Confirm completed load after table is filtered
    if (filteredtableData.length > 0) setFetchingTableDataStatus(false);
  }, [filteredtableData]);

  useEffect(() => {
    setPreviousTableData((prev) => {
      //Control the previous searches so we get a result when we switch between anagram Types
      let celebs = anagramType === "celebs" ? tableData : prev.celebs;
      let words = anagramType === "words" ? tableData : prev.words;
      return { celebs, words };
    });
    //Filter table data using current threshold values
    setFilteredTableData(() => {
      return tableData.filter(
        (data) =>
          data["%"] >= thresholdSliders[0] && data["%"] <= thresholdSliders[1]
      );
    });
    //thresholdSliders dependancy is excluded because this is already managed in its own state and another state that triggers this effect
  }, [tableData]);

  useEffect(() => {
    //When the previous state is updated by performing a new search, update the table data
    //This provides a sensible way to update everything at once
    // TODO:Highlight the most recent search button
    if (previousSearchesData.length > 0) {
      //If the previous data does not include table data, don't do this
      if (previousSearchesData[0].tableData !== undefined) {
        setTableData(() => previousSearchesData[0].tableData);
      }
    } else {
      //If there are no previous searches, there is no current search
      setCurrentSearch(null);
      setTableData([]);
    }
    //Send updated previous data to firestore,but without tableData
    if (loggedIn) {
      const minimalPreviousData = previousSearchesData.map((data) => {
        return {
          value: data.value,
          title: data.title,
          anagramType: data.anagramType,
        };
      });
      setPreviousDataToFirestore(user.email, minimalPreviousData);
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
            loggedIn,
            currentSearch,
            previousTableData,
            setCurrentSearch,
            setAnagramType,
            setInputvalueState,
            updateActiveHistoryButtonStatus,
            setToggleCollapedSider,
            setTableData,
            setFetchingTableDataStatus,
            setPreviousSearchesData,
            setLoggedIn,
          }}
        >
          <Route exact path="/">
            <StickySide />
          </Route>
          <Row
            className="contentful-page"
            style={{ width: "100%", height: "100%" }}
          >
            <Col span={24}>
              <PageHeader
                anagramType={anagramType}
                setAnagramType={setAnagramType}
                user={user}
              />
              <Route
                exact
                path="/logIn"
                render={(props) => <RegisterPage {...props} />}
              ></Route>
              <Route
                exact
                path="/register"
                render={(props) => <RegisterPage {...props} />}
              ></Route>
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
                          setThresholdSliders={setThresholdSliders}
                          setFilteredTableData={setFilteredTableData}
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
