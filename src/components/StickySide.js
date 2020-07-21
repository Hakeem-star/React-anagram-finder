import React, { useContext } from "react";
import PreviousSearches from "./loading/PreviousSearches";
import { Layout, message } from "antd";
import "./StickySide.less";
import {
  ReloadOutlined,
  DownloadOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { addSharedSearchToFirestore } from "../firebase/firebase-setup";
import { AppContext } from "./../App";
import { openNotification } from "./SharedResultDisplay";

const { Sider } = Layout;

export default function StickySide() {
  const {
    toggleCollapedSider,
    setToggleCollapedSider,
    previousSearchesData,
    anagramType,
  } = useContext(AppContext);

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
          onClick={async () => {
            //generateUUID & send to firebase
            if (previousSearchesData.length > 0) {
              const shareURL = await addSharedSearchToFirestore(
                previousSearchesData,
                anagramType
              );
              console.log(shareURL);
              //recieve confirmation that entry was added
              openNotification(shareURL);
              //Display something showing the url as well as icon to copy
            } else {
              message.error("Search for an anagram first");
            }
          }}
        />
        <DownloadOutlined className="sider-container__icon-container__icon" />
      </div>
    </div>
  );
}
