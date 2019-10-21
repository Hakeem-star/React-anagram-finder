import React from "react";
import "./dual-ring.css";

export default function Loading(props) {
  return (
    <div className="container">
      <div style={{ display: props.display }} className="lds-dual-ring"></div>
    </div>
  );
}
