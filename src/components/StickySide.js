import React, { useContext } from "react";
import PreviousSearches from "./PreviousSearches";
import { Row, Layout, message, Button } from "antd";
import "./StickySide.less";
import {
  ReloadOutlined,
  DownloadOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { addSharedSearchToFirestore } from "../firebase/firebase-setup";
import { AppContext } from "./../App";
import { openNotification } from "./SharedResultDisplay";
import { useShareSearch } from "../utils/useShareSearch";

const { Sider } = Layout;

export default function StickySide() {
  const {
    toggleCollapedSider,
    setToggleCollapedSider,
    setTableData,
    previousSearchesData,
    setPreviousSearchesData,
    anagramType,
    setCurrentSearch,
  } = useContext(AppContext);
  const clearAllDisabledStatus = () => {
    return previousSearchesData.length < 1;
  };
  const shareSearch = useShareSearch();
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
        <PreviousSearches />
        <Button
          danger
          disabled={clearAllDisabledStatus()}
          className="sider-container__clear-all-button"
          onClick={() => {
            //Clear previous searched
            setPreviousSearchesData(() => {
              return [];
            });
          }}
        >
          Clear All
        </Button>
      </Sider>
      <div className="sider-container__icon-container">
        <ReloadOutlined
          className="sider-container__icon-container__icon history-icon"
          onClick={() => {
            setToggleCollapedSider((value) => {
              return value ? false : true;
            });
          }}
        />
        <ShareAltOutlined
          className="sider-container__icon-container__icon share-icon"
          onClick={() => shareSearch()}
        />
        <DownloadOutlined className="sider-container__icon-container__icon" />
      </div>
    </div>
  );
}
