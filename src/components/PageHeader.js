import React from "react";
import "./StickySide.less";
import { Layout, Menu, Avatar } from "antd";
import "./PageHeader.less";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

export default function PageHeader({ anagramType, setAnagramType }) {
  return (
    <Header className="page-header">
      <div className="page-header__top">
        <h1>Anagram Finder</h1>
        <div className="page-header__top__options">
          <span>History</span>
          <span>Share</span>
        </div>
        <Avatar
          className="page-header__top__avatar"
          size="medium"
          icon={<UserOutlined />}
        />
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
