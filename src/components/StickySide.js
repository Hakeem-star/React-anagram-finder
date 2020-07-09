import React, { useState, Fragment } from "react";
import PreviousSearches from "./loading/PreviousSearches";
import { Layout } from "antd";
import "./StickySide.less";
import { HistoryOutlined } from "@ant-design/icons";
const { Sider } = Layout;

export default function StickySide({
  updateActiveHistoryButtonStatus,
  previousSearches,
  toggleCollapedSider,
  setToggleCollapedSider,

  updateTableData,
}) {
  // useEffect(()=>{

  // },[])

  return (
    <div className="sider-container">
      <Sider
        collapsible
        collapsedWidth={0}
        width={300}
        className="sider-container__site-layout-background"
        trigger={null}
        collapsed={toggleCollapedSider}
      >
        <div>History</div>
        <PreviousSearches
          activateHistory={updateActiveHistoryButtonStatus}
          previousSearches={previousSearches}
          updateTableData={updateTableData}
        ></PreviousSearches>
      </Sider>
      <div className="sider-container__history-icon-container">
        <HistoryOutlined
          className="sider-container__history-icon-container__icon"
          onClick={() => {
            setToggleCollapedSider((value) => {
              return value ? false : true;
            });
          }}
        />
      </div>
    </div>
  );
}
