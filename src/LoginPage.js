import React from "react";
import { Form, Input, Button, Checkbox, Layout, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Route, Link } from "react-router-dom";

import "./LoginPage.less";
export default function LoginPage() {
  return (
    <Row justify="center" align="center">
      <Col style={{ marginTop: "230px" }} span={6}>
        <h1>Log in</h1>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          // onFinish={onFinish}
        >
          <Form.Item
            name="Email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
              type="email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item className="site-form-item-row remember-forgot">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            {/* <span>
              <a className="login-form-forgot" href="">
                Forgot password
              </a>
            </span> */}
          </Form.Item>

          <Form.Item className="site-form-item-row login-register">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            <Link className="login-register-link" to="register">
              Register now!
            </Link>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
