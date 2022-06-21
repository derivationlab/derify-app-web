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
  console.log(22, trader);
  const { bondInfo, pmrBalance, pmrAccumulatedBalance, edrfInfo, accountData } =
    useSelector((state: RootStore) => state.reward);
  const reloadRewardDataStatus = useSelector(
    (state: RootStore) => state.app.reloadDataStatus.reward
  );

  useEffect(() => {
    const loadEarningDataAction = RewardModel.actions.loadEarningData(
      trader as any
    );
    loadEarningDataAction(dispatch);
  }, [trader, reloadRewardDataStatus]);

  function numFormat(num: any, bit = -8) {
    let value = fck(num, bit, 2);
    return value.split(".");
  }
  const uName = getUSDTokenName();
  // Position Mining data
  const totalPosValueArr = numFormat(accountData.totalPositionAmount);
  const claimableValueArr = numFormat(pmrBalance);
  const accumlateValueArr = numFormat(pmrAccumulatedBalance);

  // DRF Pool data
  const drfBalanceArr = numFormat(edrfInfo.drfBalance);
  const edrfBalanceArr = numFormat(edrfInfo.edrfBalance);

  // edrf pool data
  const edrfAPYarr = numFormat(bondInfo.bondAnnualInterestRatio, -6);
  const depositArr = numFormat(bondInfo.bondReturnBalance);
  const bondBalanceArr = numFormat(bondInfo.bondBalance);

  return (
    <div className="wrapper">
      {
        // -----  Position Mining start ------
      }
      <Title
        t1="Position Mining"
        t2="Open position to earn position mining rewards."
      />
      <div className="datas">
        <CenterData b="**" s=".**%(max)" />
        <div className="b2">
          <div className="t1">Claimable</div>
          <Value
            unit={uName}
            b={claimableValueArr[0]}
            s={`.${claimableValueArr[1]}`}
          />
          <Value unit="DRF" b="*" s=".*" />
          <div className="desc">
            Total earned :{" "}
            <span className="v">{accumlateValueArr.join(".")}</span> USDT and{" "}
            <span className="v">*.*</span> DRF
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
            unit={uName}
            b={totalPosValueArr[0]}
            s={"." + totalPosValueArr[1]}
          />
          <div className="t2" />
          <div className="desc">
            Total positions : <span className="v">**</span> USDT
          </div>
          <Button
            className="earn-btn"
            fill={true}
            text="Open Position"
            click={props.toTrade}
          />
        </div>
      </div>
      {
        // -----  Position Mining end  -----
      }

      {
        // -----  DRF Pool start ------
      }

      <Title
        t1="DRF Pool"
        t2="Stake DRF to mint and use eDRF, the ultilized token of Derify protocol."
      />

      <div className="datas">
        <CenterData b="**" s=".**%" />
        <div className="b2">
          <div className="t1">Claimable</div>
          <Value
            unit="eDRF"
            b={edrfBalanceArr[0]}
            s={`.${edrfBalanceArr[1]}`}
          />
          <div className="t2"></div>
          <div className="desc">
            Total earned : <span className="v">**.**</span>eDRF
          </div>
          <Button
            className="earn-btn"
            fill={true}
            text="Claim All"
            click={() => {
              props.showModal('eDRFWithdraw')
            }}
          />
        </div>

        <div className="b2 b3">
          <div className="t1">Staked</div>
          <Value unit="DRF" b={drfBalanceArr[0]} s={`.${drfBalanceArr[1]}`} />
          <div className="t2" />
          <div className="desc">
            Current pool size :{" "}
            <span className="v">{drfBalanceArr.join(".")}</span> DRF
          </div>
          <Button
            className="earn-btn"
            fill={true}
            text="Stake"
            click={() => {
              props.showModal('Stake DRF' )
            }}
          />
          <Button
            className="earn-btn earn-btn2"
            text="UnStake"
            click={() => {
              props.showModal('Unstake DRF')
            }}
          />
        </div>
      </div>

      {
        // -----  DRF Pool end ------
      }

      {
        // -----  bDRF Pool start ------
      }
      <Title
        t1="bDRF Pool"
        t2="Deposit bDRF to earn stable interests, or exchange bDRF to stable coin."
      />

      <div className="datas">
        <CenterData b={edrfAPYarr[0]} s={`.${edrfAPYarr[1]}%`} />
        <div className="b2">
          <div className="t1">Intrests</div>
          <Value
            unit="bDRF"
            b={bondBalanceArr[0]}
            s={`.${bondBalanceArr[1]}`}
          />
          <div className="t2"></div>
          <div className="desc">
            Exchangeable : <span className="v">**.*</span>bDRF
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
          <Value unit="bDRF" b={depositArr[0]} s={`.${depositArr[1]}`} />
          <div className="t2" />
          <div className="desc">
            Total deposited : <span className="v">**.*M</span> bDRF
          </div>
          <Button
            className="earn-btn"
            fill={true}
            text="Stake"
            click={() => {
              props.showModal('Stake bDRF')
            }}
          />
          <Button
            className="earn-btn earn-btn2"
            text="UnStake"
            click={() => {
              props.showModal('UnStake bDRF')
            }}
          />
        </div>
      </div>
      {
        // -----  bDRF Pool end ------
      }
    </div>
  );
}
