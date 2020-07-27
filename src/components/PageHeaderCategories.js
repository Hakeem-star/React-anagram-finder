import React, { useContext } from "react";
import { Menu, Row } from "antd";
import { AppContext } from "./../App";

export default function PageHeaderCategories() {
  const { anagramType, setAnagramType } = useContext(AppContext);
  return (
    <Row>
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
            setAnagramType("words");
          }}
          className="page-header__menu__menu-item page-header__menu__menu-item-words"
          key="words"
        >
          Words
        </Menu.Item>
      </Menu>
    </Row>
  );
}
