import React from "react";
import { notification, Button, Result, Typography, Divider } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";

import "./openSharedNotification.less";
const { Text } = Typography;

export const openSharedNotification = (url) => {
  //Close other notifications first
  notification.destroy();
  notification.open({
    message: <Divider>Shareable URL</Divider>,
    description: (
      <Text keyboard copyable>
        {url}
      </Text>
    ),
    icon: <ShareAltOutlined style={{ color: "#108ee9" }} />,
    className: "shared-result-display",
    duration: 0,
    placement: "bottomLeft",
  });
};

export default { openSharedNotification };
