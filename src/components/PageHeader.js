import React, { useState, useContext } from "react";
import "./StickySide.less";
import { Layout, message, Avatar, Popover, List, Row } from "antd";
import "./PageHeader.less";
import { UserOutlined } from "@ant-design/icons";
import { useShareSearch } from "../utils/useShareSearch";
import PageHeaderCategories from "./PageHeaderCategories";
import { Route, Link } from "react-router-dom";
import { AppContext } from "./../App";
import { signOut } from "./../firebase/firebase-setup";

const { Header } = Layout;

export default function PageHeader({ anagramType, setAnagramType, user }) {
  const shareSearch = useShareSearch();
  const [popoverState, setPopoverState] = useState(false);
  const { loggedIn } = useContext(AppContext);

  const data = loggedIn
    ? [
        [
          <span key="username" className="username">
            {user.email}
          </span>,
        ],
        [
          <span
            key="log-out"
            className="log-out"
            onClick={() => {
              signOut().then(() => {
                message.error("Logged out!");
              });
            }}
          >
            Log Out
          </span>,
        ],
      ]
    : [
        [
          <Link key="logIn" to={`/logIn`}>
            Log in
          </Link>,
        ],
        [
          <Link key="register" to={`/register`}>
            Register
          </Link>,
        ],
      ];

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
              dataSource={data}
              renderItem={(item, index) => (
                <List.Item
                  onClick={() => {
                    setPopoverState((state) => (state ? false : true));
                  }}
                >
                  {item}
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
