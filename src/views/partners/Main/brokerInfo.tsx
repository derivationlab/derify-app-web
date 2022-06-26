import React, { useState,useCallback } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootStore } from "@/store";
import { BrokerAccountInfo } from "@/store/modules/broker";
import Broker from "@/components/broker";
import Notice from "@/components/notice";
import Button from "@/components/buttons/borderButton";
import share1 from "@/assets/images/share1.png";
import paste from "@/assets/images/paste.png";
import Modal from "./modal";
import { getUSDTokenName } from "@/config";
import { fck } from "@/utils/utils";
import EarnModal from './modal/index'

function BrokerInfo() {
  const [showModal, setModal] = useState(false);
  const [visible, setVisible] = useState(false);
  // @ts-ignore
  const brokerData = useSelector<RootStore, BrokerAccountInfo>(
    s => s.broker.broker
  );
  console.log(brokerData);

  // the expire date data
  const expireDate = brokerData.expireDate;
  const days =
    (expireDate.getTime() - new Date().getTime()) / (1000 * 24 * 60 * 60);
  let month: any = expireDate.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  let day: any = expireDate.getDay();
  day = day < 10 ? "0" + day : day;
  console.log(brokerData);
  let balanceArr = fck(brokerData.rewardBalance, -8, 2).split(".");
  let accumulateArr = fck(brokerData.accumulatedReward, -8, 2);
  let dailyData = fck(brokerData.todayReward, -8, 2);
  


  return (
    <div className="broker-info-part">
      {showModal && (
        <Modal
          close={() => {
            setModal(false);
          }}
          confirm={() => {
            setModal(false);
          }}
        />
      )}
      <div className="data">
        <div className="balance">
          <Button
            fill={true}
            className="claim-btn"
            click={() => {
              setModal(true);
            }}
            text="Claim All"
          />
          <div className="t">Broker Account Balance</div>
          <div className="t1">
            {balanceArr[0]}
            <span className="small-num">.{balanceArr[1]}</span>
            <span className="unit">{getUSDTokenName()}</span>
          </div>
          <div className="t2">
            You've earned a total of <span className="b">{accumulateArr}</span>{" "}
            USDT since{" "}
            <span className="b">
              {brokerData.update_time
                ? moment(brokerData.update_time).format("YYYY-MM-DD")
                : "-"}
            </span>
          </div>
        </div>
        <div className="cards">
          <div className="d">
            <div className="t">Daily Rewards</div>
            <div className="t1">{dailyData}</div>
            <div className="t2">
              <span className="b">12.34%</span>
              in total rewards
            </div>
          </div>
          <div className="d">
            <div className="t">Daily Active Trader</div>
            <div className="t1">234</div>
            <div className="t2">
              <span className="b">1234</span> transactions
            </div>
          </div>
          <div className="d">
            <div className="t">Broker Rank</div>
            <div className="t1">#24</div>
            <Link to="/broker-list">
              <div className="t2 t3">
                Rank List <img src={share1} alt="" />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="info-detail">
        <Broker data={brokerData} className="info-detail-broker" />
        <div className="desc">{brokerData.introduction || "-"}</div>
        <div className="card">
          <Button
            fill={true}
            className="card-btn"
            click={() => {
              setVisible(true)
            }}
            text="Extend"
          />
          <div className="t">
            Broker Privilege Expiration
            <Notice title="Broker Privilege Expiration" />
          </div>
          <div className="days">
            <span className="num">{Math.floor(days)}</span>
            <span className="d">days</span>
          </div>
          <div className="expire">
            <div>
              expire at{" "}
              <span className="d">
                {expireDate.getFullYear()}-{month}-{day}
              </span>
            </div>
            <div className="link">
              <a href={brokerData.reference} target="_blank" rel="noreferrer">
                My promotion link
              </a>
              <img src={paste} alt="" />
              <img src={share1} alt="" />
            </div>
          </div>
        </div>
      </div>
      {
        visible? <EarnModal
        closeModal={()=>setVisible(false)}
        /> : null
      }
    </div>
  );
}

export default BrokerInfo;
