import React from "react";
import { Popover, Button, Row, Col } from "antd";

export default function PreviousSearches({
  previousSearches,
  activateHistory,

  updateTableData,
}) {
  if (previousSearches.length < 1) {
    return <div></div>;
  }
  return (
    <div className="previous-search">
      {previousSearches.map((result, index, original) => {
        let correctIndex = original.length - index - 1;
        return (
          <Row key={`${result.title}${correctIndex}`}>
            <Col span={12} push={6}>
              <Popover
                placement="right"
                className={`previous-search__item result-${correctIndex}`}
                content={result.value}
                title={result.title}
              >
                <Button
                  onClick={() => {
                    // console.log(correctIndex);
                    activateHistory(correctIndex);
                    updateTableData(result.tableData);
                  }}
                  style={{ width: "100%" }}
                  type="primary"
                >
                  {result.name}
                </Button>
              </Popover>
            </Col>
          </Row>
        );
      })}
    </div>
  );
}
