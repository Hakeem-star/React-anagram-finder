import React, { Fragment } from "react";
import { Slider, InputNumber } from "antd";
import { Layout, Row, Col } from "antd";

import "./ThresholdSlider.less";

export default function ThresholdSlider({
  setThresholdSliders,
  setFilteredTableData,
  tableData,
  thresholdSliders,
}) {
  return (
    <Col>
      <Row justify="end" align="middle">
        <InputNumber
          min={1}
          max={100}
          value={thresholdSliders[0]}
          onChange={(value) => {
            setThresholdSliders([value, thresholdSliders[1]]);
            setFilteredTableData(() => {
              return tableData.filter(
                (data) => data["%"] >= value && data["%"] <= thresholdSliders[1]
              );
            });
          }}
        />
        <InputNumber
          min={1}
          max={100}
          value={thresholdSliders[1]}
          onChange={(value) => {
            setThresholdSliders([thresholdSliders[0], value]);
            setFilteredTableData(() => {
              return tableData.filter(
                (data) => data["%"] >= thresholdSliders[0] && data["%"] <= value
              );
            });
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: "32px",
            backgroundColor: "#e3e5e6",
            padding: "0 4px",
            fontWeight: "700",
          }}
        >
          <p style={{ margin: 0 }}>%</p>
        </div>
      </Row>
      <Slider
        defaultValue={[1, 100]}
        range
        min={1}
        className="threshold-slider"
        value={thresholdSliders}
        onChange={(value) => {
          setThresholdSliders(value);
        }}
        //Updating too often causes slowdown when there are lots of anagrams to look for
        //So only change after we land on a value
        onAfterChange={(value) => {
          setFilteredTableData(() => {
            return tableData.filter(
              (data) => data["%"] >= value[0] && data["%"] <= value[1]
            );
          });
        }}
        tipFormatter={(value) => `${value}%`}
      />
    </Col>
  );
}
