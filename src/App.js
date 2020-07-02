import React, { useState, useEffect } from "react";
import celebAnagramFinder from "./celebAnagramFinderAPICall";
import { Layout, Menu, Input, Divider, Table, Row, Col, Slider } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import "antd/dist/antd.less";
import "./App.less";

const { Header, Content, Sider } = Layout;

const menuItemStyle = {
  width: "49%",
  textAlign: "center",
  height: "100%",
  lineHeight: "100px",
  fontSize: "37px",
};

const pageTitleStyle = {
  color: "white",
  fontSize: "23px",
  textAlign: "center",
  paddingTop: "37px",
};

const dataSource = [
  {
    key: "1",
    Anagram: "Anagram",
    Name: "Mike",
    "%": "10 Downing Street",
  },
  {
    key: "2",
    Anagram: 42,
    Name: "John",
    "%": "10 Downing Street",
  },
];

const columns = [
  {
    title: "Anagram",
    dataIndex: "Anagram",
    key: "Anagram",
  },
  {
    title: "Name",
    dataIndex: "Name",
    key: "Name",
  },

  {
    title: "%",
    dataIndex: "%",
    key: "%",
  },
];

function formatter(value) {
  return `${value}%`;
}

export default function App() {
  const [tableData, updateTableData] = useState([]);
  const [fetchingTableDataStatus, updateFetchingTableDataStatus] = useState(
    false
  );

  useEffect(() => {
    if (fetchingTableDataStatus) {
    }
  }, [fetchingTableDataStatus]);

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider width={300} className="site-layout-background">
        <div style={pageTitleStyle}>Anagram Finder</div>
      </Sider>
      <Layout>
        <Header style={{ padding: "0", height: "100px" }}>
          <Menu style={{ width: "100%", height: "100%" }} mode="horizontal">
            <Menu.Item style={menuItemStyle} key="General">
              General
            </Menu.Item>
            <Divider style={{ height: "100%" }} type="vertical" />
            <Menu.Item style={menuItemStyle} key="Celebs">
              Celebs
            </Menu.Item>
          </Menu>
        </Header>
        <Input
          className="search"
          placeholder="input anagram"
          size="37px"
          style={{
            borderTop: 0,
            width: "100%",
            height: "100px",
            paddingLeft: "40px",
          }}
          onPressEnter={async (e) => {
            updateFetchingTableDataStatus(true);
            let input = await celebAnagramFinder(e.target.value);
            updateFetchingTableDataStatus(false);
            updateTableData(input);
            console.log(input);
          }}
          suffix={
            <SearchOutlined
              style={{
                fontSize: "21px",
                marginRight: "50px",
              }}
            />
          }
        />
        <Content style={{ marginTop: "80px" }}>
          <Row justify="left">
            <Col offset={2} span={20}>
              <div>Results</div>
            </Col>
          </Row>
          <Row justify="center">
            <Col span={16}>
              <Slider
                defaultValue={[1, 100]}
                range
                min={1}
                className="threshold-slider"
                tooltipVisible={true}
                tipFormatter={formatter}
              />
            </Col>
          </Row>
          <Row justify="center">
            <Col span={20}>
              <Table
                loading={fetchingTableDataStatus}
                dataSource={tableData}
                columns={columns}
              />
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
