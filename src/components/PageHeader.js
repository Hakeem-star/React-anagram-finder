import React from "react";
import "./StickySide.less";
import { Layout, Menu } from "antd";
import "./PageHeader.less";

const { Header } = Layout;

export default function PageHeader({ setAnagramType }) {
  return (
    <Header className="page-header">
      <div>
        <h1>Anagram Finder</h1>
      </div>
      <Menu
        className="page-header__menu"
        style={{ width: "100%", height: "100%", lineHeight: "0" }}
        mode="horizontal"
        defaultSelectedKeys={["celebs"]}
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
