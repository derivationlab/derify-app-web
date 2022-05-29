import React, { useEffect, useState } from "react";
import moment from "moment";
import Broker from "@/components/broker";
import { getBrokerByAddr } from "@/api/broker";

export default function Step1(props: { join: any; id: any }) {
  const [data, setData] = useState({} as any);

  useEffect(() => {
    getBrokerByAddr(props.id).then(r => {
      setData(r.data ? r.data[0] : {});
    });
  }, []);

  // calculate the date from now, how many days
  function format(date: any) {
    const d = moment(date).valueOf();
    const today = new Date().getTime();
    let day = 24 * 3600 * 1000;
    return Math.floor((today - d) / day);
  }

  return (
    <div className="not-a-broker">
      <div className="main-panel">
        <Broker data={data} className="list-broker" />
        <div className="desc">{data.introduction || "-"}</div>
        <div className="data">
          <div className="data1">
            <div className="line1">You've registered</div>
            <div className="num">
              {data.update_time ? format(data.update_time) : ""}
            </div>
            <div className="unit">days</div>
          </div>
          <div className="data2">
            <div className="line1">You've made</div>
            <div className="num">{"--"}</div>
            <div className="unit">transactions</div>
          </div>
          <div className="vr" />
        </div>
      </div>
      <div className="apply" onClick={props.join}>
        Join us to be a BROKER !
      </div>
    </div>
  );
}
