import React, { useEffect, useState } from "react";
import IconFont from "@/components/IconFont";
import { FormattedMessage, useIntl } from "react-intl";
import { Title, Value, CenterData } from "./index.component";
import Button from "@/components/buttons/borderButton";
import { RewardModel, RootStore, DataModel } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { fck } from "@/utils/utils";
import { RewardsType } from "@/store/modules/reward";
import WalletConnectButtonWrapper from "@/views/CommonViews/ButtonWrapper";
import { getUSDTokenName } from "@/config";

type Props = {
  showModal: any;
  toTrade: any;
};

export default function MainData(props: Props) {
  const dispatch = useDispatch();
  const trader = useSelector((state: RootStore) => state.user.selectedAddress);
  const {
    bondInfo,
    wallet,
    pmrBalance,
    pmrAccumulatedBalance,
    edrfInfo,
    accountData,
  } = useSelector((state: RootStore) => state.reward);
  const reloadRewardDataStatus = useSelector(
    (state: RootStore) => state.app.reloadDataStatus.reward
  );
  useEffect(() => {
    const loadEarningDataAction = RewardModel.actions.loadEarningData(trader);
    loadEarningDataAction(dispatch);
  }, [trader, reloadRewardDataStatus]);


  function numFormat(num: any) {
    let value = fck(num, -8, 2);
    return value.split(".");
  }
  const totalPosValueArr = numFormat(accountData.totalPositionAmount);
  const claimableValueArr = numFormat(pmrBalance);
  const accumlateValueArr = numFormat(pmrAccumulatedBalance);

  return (
    <div className="wrapper">
      <Title
        t1="Position Mining"
        t2="Open position to earn position mining rewards."
      />

      <div className="datas">
        <CenterData b="98" s=".34%(max)" />
        <div className="b2">
          <div className="t1">Claimable</div>
          <Value
            unit={getUSDTokenName()}
            b={claimableValueArr[0]}
            s={`.${claimableValueArr[1]}`}
          />
          <Value unit="DRF" b="0" s=".0" />
          <div className="desc">
            Total earned : <span className="v">{accumlateValueArr.join(".")}</span> USDT and{" "}
            <span className="v">0.0</span> DRF
          </div>
          <Button
            className="earn-btn"
            fill={true}
            text="Claim All"
            click={() => {
              props.showModal("Stake DRF");
            }}
          />
        </div>

        <div className="b2 b3">
          <div className="t1">Positions</div>
          <Value
            unit={getUSDTokenName()}
            b={totalPosValueArr[0]}
            s={"." + totalPosValueArr[1]}
          />
          <div className="t2" />
          <div className="desc">
            Total positions : <span className="v">--</span> USDT
          </div>
          <Button
            className="earn-btn"
            fill={true}
            text="Open Position"
            click={props.toTrade}
          />
        </div>
      </div>

      <Title
        t1="DRF Pool"
        t2="Stake DRF to mint and use eDRF, the ultilized token of Derify protocol."
      />

      <div className="datas">
        <CenterData b="34" s=".34%" />
        <div className="b2">
          <div className="t1">Claimable</div>
          <Value unit="eDRF" b="67456" s=".2" />
          <div className="t2"></div>
          <div className="desc">
            Total earned : <span className="v">987124867345.4</span>eDRF
          </div>
          <Button
            className="earn-btn"
            fill={true}
            text="Claim All"
            click={() => {
              console.log(111);
            }}
          />
        </div>

        <div className="b2 b3">
          <div className="t1">Staked</div>
          <Value unit="DRF" b="45" s=".1" />
          <div className="t2" />
          <div className="desc">
            Current pool size : <span className="v">81677.44</span> DRF
          </div>
          <Button
            className="earn-btn"
            fill={true}
            text="Stake"
            click={() => {
              console.log(111);
            }}
          />
          <Button
            className="earn-btn earn-btn2"
            text="UnStake"
            click={() => {
              console.log(111);
            }}
          />
        </div>
      </div>

      <Title
        t1="bDRF Pool"
        t2="Deposit bDRF to earn stable interests, or exchange bDRF to stable coin."
      />

      <div className="datas">
        <CenterData b="12" s=".34%" />
        <div className="b2">
          <div className="t1">Intrests</div>
          <Value unit="bDRF" b="1456" s=".2" />
          <div className="t2"></div>
          <div className="desc">
            Exchangeable : <span className="v">0.334</span>bDRF
          </div>
          <Button
            className="earn-btn"
            fill={true}
            text="Claim All"
            click={() => {
              console.log(111);
            }}
          />
          <Button
            className="earn-btn earn-btn2"
            text="Exchange"
            click={() => {
              console.log(111);
            }}
          />
        </div>

        <div className="b2 b3">
          <div className="t1">Deposited</div>
          <Value unit="bDRF" b="4344565" s=".133" />
          <div className="t2" />
          <div className="desc">
            Total deposited : <span className="v">87.44M</span> bDRF
          </div>
          <Button
            className="earn-btn"
            fill={true}
            text="Stake"
            click={() => {
              console.log(111);
            }}
          />
          <Button
            className="earn-btn earn-btn2"
            text="UnStake"
            click={() => {
              console.log(111);
            }}
          />
        </div>
      </div>
    </div>
  );
}
