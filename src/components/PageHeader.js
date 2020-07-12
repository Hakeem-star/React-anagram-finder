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
      >
        <Menu.Item
          onClick={() => {
            setAnagramType("General");
          }}
          className="page-header__menu__menu-item"
          key="General"
        >
          General
        </Menu.Item>
        <li className="page-header__menu__custom-menu-divider"></li>

        <Menu.Item
          onClick={() => {
            setAnagramType("Celebs");
          }}
          className="page-header__menu__menu-item"
          key="Celebs"
        >
          Celebs
        </Menu.Item>
      </Menu>
    </Header>
  );
}
