import * as React from "react";
import Deri from "@/assets/images/deri.png";
import tg from "@/assets/images/social/tg.png";
import social from "@/assets/images/social/social.png";
import social2 from "@/assets/images/social/social2.png";
import twitter from "@/assets/images/social/twitter.png";
import wechat from "@/assets/images/social/wechat.png";
import "./index.less";

export interface BrokerProps {
  data: any;
  className: string;
}

export default function Broker({ data, className }: BrokerProps) {
  return (
    <div className={`broker-info ${className || ""}`}>
      <div className="avatar">
        {data.logo ? (
          <img src={data.logo} alt="" />
        ) : (
          <div className="default">
            <img src={Deri} alt="" />
          </div>
        )}
      </div>
      <div className="infos">
        <div className="h2">{data.name}</div>
        <div className="h3">@{data.id}</div>
        <div className="icons">
          <div className="link">
            <img src={tg} alt="" className="img1" />
          </div>
          <div className="link">
            <img src={social} alt="" className="img2" />
          </div>
          <div className="link">
            <img src={twitter} alt="" className="img1" />
          </div>
          <div className="link">
            <img src={social2} alt="" className="img2" />
          </div>
          <div className="link">
            <img src={wechat} alt="" className="img3" />
          </div>
        </div>
        <div className="langs">
          <span className="lang">English</span>
          <span className="lang">简体中文</span>
          <span className="lang">繁體中文</span>
        </div>
      </div>
    </div>
  );
}
