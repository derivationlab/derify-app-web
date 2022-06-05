import ReactDOM from "react-dom";
import { message } from "antd";

import "./index.css";
import App from './App';

import LogRocket from 'logrocket';

const release = process.env.REACT_APP_VERCEL_GIT_COMMIT_SHA || 'local'
const env = process.env.REACT_APP_VERCEL_ENV
LogRocket.init('5vthie/derifyexchange', {
  release
});
// console.log('release', release);
// console.log('env', env);

message.config({
  top: 80,
});

ReactDOM.render(<App />, document.getElementById("root"));
