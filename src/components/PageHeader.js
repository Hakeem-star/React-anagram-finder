import React, { useState } from "react";
import "./StickySide.less";
import { Layout, Menu, Avatar, Popover, List } from "antd";
import "./PageHeader.less";
import { UserOutlined } from "@ant-design/icons";
import { useShareSearch } from "../utils/useShareSearch";

const { Header } = Layout;

export default function PageHeader({ anagramType, setAnagramType }) {
  const shareSearch = useShareSearch();
  const [popoverState, setPopoverState] = useState(false);

  return (
    <Header className="page-header">
      <div className="page-header__top">
        <h1>Anagram Finder</h1>
        <div className="page-header__top__options">
          <span>History</span>
          <span onClick={shareSearch}>Share</span>
        </div>

        <Popover
          overlayClassName="page-header__top__avatar__popover"
          content={
            <List
              size="small"
              dataSource={["Log in", "Register"]}
              renderItem={(item) => (
                <List.Item>
                  <a href="#">{item}</a>
                </List.Item>
              )}
            />
          }
          trigger="click"
          visible={popoverState}
          onVisibleChange={() => {
            setPopoverState((state) => (state ? false : true));
          }}
        >
          <Avatar
            className="page-header__top__avatar"
            size="medium"
            icon={<UserOutlined />}
          />
        </Popover>
      </div>
      <Menu
        className="page-header__menu"
        style={{ width: "100%", height: "100%", lineHeight: "0" }}
        mode="horizontal"
        defaultSelectedKeys={["celebs"]}
        selectedKeys={[anagramType]}
      >
        <Menu.Item
          onClick={() => {
            setAnagramType("celebs");
          }}
          className="page-header__menu__menu-item page-header__menu__menu-item-celebs"
          key="celebs"
        >
          Celebs
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            setAnagramType("general");
          }}
          className="page-header__menu__menu-item page-header__menu__menu-item-general"
          key="general"
        >
          General
        </Menu.Item>
      </Menu>
    </Header>
  );
}
