import React from "react";
import { notification, Button } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import "./SharedResultDisplay.less";

export const openNotification = (url) => {
  notification.open({
    message: "Notification Title",
    description: url,
    icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    className: "shared-result-display",
  });
};

export default { openNotification };
