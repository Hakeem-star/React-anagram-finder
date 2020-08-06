import React, { useContext, useEffect, useRef } from "react";
import { Popover, Button, Row, Col, Divider, Space } from "antd";
import { AppContext } from "../App";
import useURLSharedSearch from "../utils/useURLSharedSearch";
import "./PreviousSearches.less";
import { useShareSearch } from "./../utils/useShareSearch";

export default function PreviousSearches() {
  const {
    setInputvalueState,
    updateActiveHistoryButtonStatus,
    setTableData,
    previousSearchesData,
    setPreviousSearchesData,
    setCurrentSearch,
    setAnagramType,
  } = useContext(AppContext);
  const search = useURLSharedSearch();
  const shareSearch = useShareSearch();

  if (previousSearchesData.length < 1) {
    return <div></div>;
  }

  return (
    <div className="previous-searches">
      {previousSearchesData.map((result, index, original) => {
        let correctIndex = original.length - index - 1;
        const trailingDots = result.value.length > 7 ? "..." : "";
        const name = `${result.value.substr(0, 8)}${trailingDots}`;

        return (
          <Row key={`${result.title}${correctIndex}`}>
            <Col
              span={12}
              push={6}
              className={`previous-searches__item result-${correctIndex}`}
            >
              <Popover
                placement="right"
                content={
                  <div>
                    <div>
                      <div className="ant-popover__space-container">
                        <span>{result.value}</span>
                        <Divider type="vertical" />
                        <span>{result.anagramType}</span>
                      </div>
                    </div>
                    <Divider className="ant-popover__divider divider-horizontal-middle" />

                    <div>
                      <div className="ant-popover__space-container">
                        <Button
                          onClick={() => {
                            shareSearch(result.value, result.anagramType);
                          }}
                          className="ant-popover__space-container__share"
                        >
                          Share
                        </Button>
                        <Divider type="vertical" />
                        <Button
                          danger
                          onClick={() => {
                            setPreviousSearchesData((previousSearches) => {
                              const stateCopy = previousSearches.slice();
                              stateCopy.splice(index, 1);
                              return stateCopy;
                            });
                            // setAnagramType()
                          }}
                          className="ant-popover__space-container__delete"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                }
                title={result.title}
              >
                <Button
                  onClick={() => {
                    updateActiveHistoryButtonStatus(correctIndex);
                    // console.log(result);
                    if (result.tableData !== undefined) {
                      setAnagramType(result.anagramType);
                      setCurrentSearch(result.value);
                      setTableData(result.tableData);
                    } else {
                      search(result.value, result.anagramType);
                    }
                    setInputvalueState(result.value);
                  }}
                  style={{ width: "100%" }}
                  type="primary"
                >
                  {name}
                </Button>
              </Popover>
            </Col>
          </Row>
        );
      })}
    </div>
  );
}
