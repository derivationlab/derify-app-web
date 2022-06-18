import React from "react";
import { TradePosition } from "@/components/trade";
import close2 from "@/assets/images/close2.png";

const Position = () => {
  return (
    <div className="pos-list">
      <TradePosition />
      <TradePosition />
      <TradePosition />
      <div className="close-all">
        <div className="btn">
          <span>CLOSE ALL</span>
          <img src={close2} alt="" />
        </div>
      </div>
    </div>
  )
}


export default Position;
