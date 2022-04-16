import React from "react";
import ReactDOM from "react-dom";
import { message } from "antd";

import "./index.css";
import App from './App';

import LogRocket from 'logrocket';
LogRocket.init('5vthie/derifyexchange');

message.config({
  top: 80,
});

ReactDOM.render(<App />, document.getElementById("root"));
