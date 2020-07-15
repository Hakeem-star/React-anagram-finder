import React, { useState, Fragment, useContext } from "react";
import PreviousSearches from "./loading/PreviousSearches";
import { Layout } from "antd";
import "./StickySide.less";
import {
  ReloadOutlined,
  DownloadOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { addSharedSearchToFirestore } from "../firebase/firebase-setup";
import { AppContext } from './../App';

const { Sider } = Layout;

export default function StickySide({

}) {

  const {
    toggleCollapedSider,
    setToggleCollapedSider,
    previousSearchesData } = useContext(AppContext);

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
          onClick={() => {
            //generateUUID & send to firebase
            addSharedSearchToFirestore(previousSearchesData);
            //recieve confirmation that entry was added

            //Display something showing the url as well as icon to copy
          }}
        />
        <DownloadOutlined className="sider-container__icon-container__icon" />
      </div>
    </div>
  );
}
