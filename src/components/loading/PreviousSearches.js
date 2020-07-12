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
        const trailingDots = result.value.length > 7 ? "..." : "";
        const name = `${result.value.substr(0, 8)}${trailingDots}`;

        return (
          <Row key={`${result.title}${correctIndex}`}>
            <Col
              span={12}
              push={6}
              className={`previous-search__item result-${correctIndex}`}
            >
              <Popover
                placement="right"
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
