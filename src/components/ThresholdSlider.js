import React, { Fragment } from "react";
import { Slider, InputNumber } from "antd";
import "./ThresholdSlider.less";

export default function ThresholdSlider({
  setThresholdSliders,
  setFilteredTableData,
  tableData,
  thresholdSliders,
}) {
  return (
    <Fragment>
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
    </Fragment>
  );
}
