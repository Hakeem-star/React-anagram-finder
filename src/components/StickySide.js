import React, { useContext, useEffect, useRef, useState } from "react";
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
import { useShareSearch } from "../utils/useShareSearch";

const { Sider } = Layout;

export default function StickySide() {
  const {
    toggleCollapedSider,
    setToggleCollapedSider,
    previousSearchesData,
    setPreviousSearchesData,
  } = useContext(AppContext);

  const [siderWidth, setSiderWidth] = useState(300);
  const shareSearch = useShareSearch();
  //Click function to close sider on click/press
  const closeClick = useRef((e) => {
    //Prevent clash with History button
    if (e.target.innerText !== "History") setToggleCollapedSider(true);
  });

  useEffect(() => {
    //If sider is open
    if (!toggleCollapedSider) {
      const sider = document.querySelector(
        ".sider-container__site-layout-background"
      );
      const closeSider = (down) => {
        let startPosition = down.changedTouches[0].clientX;

        sider.ontouchend = (up) => {
          let endPosition = up.changedTouches[0].clientX;

          if (startPosition - endPosition > 30) {
            setToggleCollapedSider(true);
          }
        };
      };
      sider.addEventListener("touchstart", closeSider, {
        once: true,
        passive: true,
      });

      return () => {
        sider.removeEventListener("touchstart", closeSider, {
          once: true,
          passive: true,
        });
      };
    }
  }, [toggleCollapedSider]);

  useEffect(() => {
    const bg = document.querySelector(".contentful-page");
    if (!toggleCollapedSider) {
      bg.addEventListener("click", closeClick.current);
      bg.addEventListener("touchend", closeClick.current, {
        once: true,
        passive: true,
      });
    } else {
      bg.removeEventListener("click", closeClick.current);
      bg.removeEventListener("touchend", closeClick.current, {
        once: true,
        passive: true,
      });
    }
  }, [toggleCollapedSider]);

  return (
    <div className="sider-container">
      <Sider
        breakpoint="xs"
        collapsible
        collapsedWidth={0}
        width={siderWidth}
        className="sider-container__site-layout-background"
        trigger={null}
        collapsed={toggleCollapedSider}
        onBreakpoint={(broken) => {
          //Adjust the width depending on the size of the screen
          if (broken) {
            setSiderWidth(150);
          } else {
            setSiderWidth(300);
          }
        }}
      >
        <div>History</div>
        <PreviousSearches />
        <Button
          danger
          disabled={previousSearchesData.length < 1}
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
        {/* <DownloadOutlined className="sider-container__icon-container__icon" /> */}
      </div>
    </div>
  );
}
