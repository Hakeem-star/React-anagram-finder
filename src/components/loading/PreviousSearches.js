import React from "react";
import { Popover, Button, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function PreviousSearches({ results, activateHistory }) {
  if (results.length < 1) {
    return <div></div>;
  }
  return (
    <div className="previous-search">
      {results.map((result, index) => (
        <Row key={`${result.title}${index}`} gutter={[0, 20]}>
          <Col span={12} push={6}>
            <Popover
              className={`previous-search__item result-${index}`}
              content={result.value}
              title={result.title}
            >
              <Button
                onClick={() => {
                  console.log(index);
                  activateHistory(index);
                }}
                style={{ width: "100%" }}
                type="primary"
              >
                {result.name}
              </Button>
            </Popover>
          </Col>
        </Row>
      ))}
    </div>
  );
}
