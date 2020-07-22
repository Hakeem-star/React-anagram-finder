import React, { useState } from "react";
import "./StickySide.less";
import { Layout, Menu, Avatar, Popover, List, Row } from "antd";
import "./PageHeader.less";
import { UserOutlined } from "@ant-design/icons";
import { useShareSearch } from "../utils/useShareSearch";
import PageHeaderCategories from "./PageHeaderCategories";
import { Route, Link } from "react-router-dom";

const { Header } = Layout;

export default function PageHeader({ anagramType, setAnagramType }) {
  const shareSearch = useShareSearch();
  const [popoverState, setPopoverState] = useState(false);

  return (
    <Header className="page-header">
      <div className="page-header__top">
        <Link className="page-header__top__title" to="/">
          <h1>Anagram Finder</h1>
        </Link>
        <Route exact path="/">
          <div className="page-header__top__options">
            <span>History</span>
            <span onClick={shareSearch}>Share</span>
          </div>
        </Route>
        <Popover
          overlayClassName="page-header__top__avatar__popover"
          content={
            <List
              size="small"
              dataSource={[
                ["Log in", "logIn"],
                ["Register", "register"],
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/${item[1]}`}>{item[0]}</Link>
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
      <Route exact path="/">
        <PageHeaderCategories />
      </Route>
    </Header>
  );
}
