import React, { useEffect, useState } from "react";
import Deri from "@/assets/images/deri.png";
import { Pagination } from "antd";
import { getBrokerList } from "@/api/broker";
import "./index.less";

export default function BrokerList() {
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  function changePage(page: number) {
    getData(page);
  }

  function getData(page: number) {
    setCurrent(page);
    getBrokerList(0).then(r => {
      console.log(r);
    });
  }

  useEffect(() => {
    getData(1);
  }, []);

  return (
    <div className="broker-list page-wrapper">
      <div className="h1">Broker Rank</div>
      <div className="hline"></div>
      <div className="table">
        <div className="tb-header">
          <div className="field field1">Name</div>
          <div className="field field2">Daily Rewards</div>
          <div className="field field3">DAU(T)</div>
          <div className="field field4">Total Rewards</div>
          <div className="field field5">MAU(T)</div>
          <div className="field field6">Rank</div>
        </div>
        <div className="tb-record">
          <div className="field field1">
            <div className="avatar">
              <div className="default">
                <img src={Deri} alt="" />
              </div>
            </div>
            <div className="titles">
              <div className="line1">Broker's Name</div>
              <div className="line2">@Broker's Name</div>
            </div>
          </div>
          <div className="field field2 num">
            56.78 <span className="unit">USDT</span>
          </div>
          <div className="field field3 num">123</div>
          <div className="field field4 num">
            532.78 <span className="unit">USDT</span>
          </div>
          <div className="field field5 num">123</div>
          <div className="field field6 num">#1</div>
        </div>
      </div>
      <div className="hline"></div>
      <Pagination current={current} total={total} onChange={changePage} />
    </div>
  );
}
