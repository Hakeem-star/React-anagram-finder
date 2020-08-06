import React, { useState, useContext, useEffect } from "react";
import { Form, Input, Button, message, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Route, Link } from "react-router-dom";
import "./RegisterPage.less";
import {
  createUserWithEmailPass,
  signInWithEmailPass,
} from "./firebase/firebase-setup";
import { AppContext } from "./App";

export default function RegisterPage({ location, history }) {
  const [formSubmission, setFormSubmission] = useState(false);
  const { loggedIn, previousSearchesData } = useContext(AppContext);

  useEffect(() => {
    //logged in
    if (loggedIn) {
      setFormSubmission(false);
      history.push({ pathname: "/" });
    }
  }, [loggedIn]);

  const pathname = location.pathname;
  const page = {};
  const registerPage = pathname.includes("register");
  registerPage ? (page.name = "Register") : (page.name = "Log in");

  return (
    <Row justify="center" align="center">
      <Col
        className="login-form-container"
        xs={{ span: 16 }}
        md={{ span: 8 }}
        lg={{ span: 6 }}
      >
        <h1>{page.name}</h1>
        <Form
          name="normal_login"
          className="login-form-container__form"
          initialValues={{
            remember: true,
          }}
          onFinish={(values) => {
            setFormSubmission(true);
            registerPage
              ? createUserWithEmailPass(values, previousSearchesData)
              : signInWithEmailPass(values)
                  .then(() => {
                    message.success({
                      content: "Logged in!",
                      key: "updatable",
                      duration: 2,
                    });
                  })
                  .catch((e) => {
                    setFormSubmission(false);
                    if (e.message.includes("no user record")) {
                      message.error("User does not exist");
                    } else if (e.message.includes("already in use")) {
                      message.error(e.message);
                    } else {
                      !e.a && message.error("Please check your password");
                    }
                  });
          }}
          onFinishFailed={() => {}}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
            label="Email"
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
              type="email"
              name="email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || value.length > 6) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "The password needs to be a minimum of 6 characters"
                  );
                },
              }),
            ]}
            label="Password"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              name="password"
            />
          </Form.Item>
          {registerPage ? (
            <Form.Item
              name="Confirm Password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "The two passwords that you entered do not match!"
                    );
                  },
                }),
              ]}
              label="Confirm Password"
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Confirm Password"
                name="confirm password"
              />
            </Form.Item>
          ) : null}
          <Form.Item className="site-form-item-row login-register">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={formSubmission}
            >
              {/* if we are not on the register page, show me Log in, else show me Register or logged in */}
              {(() => {
                if (!loggedIn && !registerPage) {
                  return "Log in";
                }
                if (loggedIn) {
                  return "Logged in";
                }
                return "Register";
              })()}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
