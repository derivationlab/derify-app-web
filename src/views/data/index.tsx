import React from "react";
import PositionHeld from "./PositionHeld";
import Info from "./Info";
import SafePool from "./SafePool";
import TradingVolume from "./TradingVolume";
import "./index.less";

const Data: React.FC = () => {
  return (
    <div className="data-page">
      <Info />
      <TradingVolume />
      <PositionHeld />
      <SafePool />
    </div>
  );
};

export default Data;
