import React, { Fragment } from "react";
import { Slider, InputNumber } from "antd";
import "./ThresholdSlider.less";

export default function ThresholdSlider({
  updateThresholdSliders,
  updateFilteredTableData,
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
          updateThresholdSliders([value, thresholdSliders[1]]);
          updateFilteredTableData(() => {
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
          updateThresholdSliders([thresholdSliders[0], value]);
          updateFilteredTableData(() => {
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
          updateThresholdSliders(value);
          updateFilteredTableData(() => {
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
