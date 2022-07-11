import React, { useEffect, useState } from "react";
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
  const { formatMessage } = useIntl();
  const $t = (id: string) => formatMessage({ id });
  const trader = useSelector((state: RootStore) => state.user.selectedAddress);
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
        t1={$t("Rewards.Mining.History.PositionMining")}
        t2={$t("openMine")}
      />
      <div className="datas">
        <CenterData b="**" s=".**%(max)" />
        <div className="b2">
          <div className="t1">{$t("Claimable")}</div>
          <Value
            unit={uName}
            b={claimableValueArr[0]}
            s={`.${claimableValueArr[1]}`}
          />
          <Value unit="DRF" b="*" s=".*" />
          <div className="desc">
            Total earned :{" "}
            <span className="v">{accumlateValueArr.join(".")}</span> {getUSDTokenName()} and{" "}
            <span className="v">*.*</span> DRF
          </div>
          <Button
            className="earn-btn"
            fill={true}
            text={$t("Claim-All")}
            click={() => {
              props.showModal("Claim BUSD");
            }}
          />
        </div>
        <div className="b2 b3">
          <div className="t1">{$t("Earn-Positions")}</div>
          <Value
            unit={uName}
            b={totalPosValueArr[0]}
            s={"." + totalPosValueArr[1]}
          />
          <div className="t2" />
          <div className="desc">
            {$t("Earn-Positions-total")} : <span className="v">**</span> {getUSDTokenName()}
          </div>
          <Button
            className="earn-btn"
            fill={true}
            text={$t("Rewards.Mining.Card.OpenPosition")}
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
        t1={$t("DRFPool")}
        t2={$t("DRFPool1")}
      />

      <div className="datas">
        <CenterData b="**" s=".**%" />
        <div className="b2">
          <div className="t1">{$t("Claimable")}</div>
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
            text={$t("Claim-All")}
            click={() => {
            }}
          />
        </div>

        <div className="b2 b3">
          <div className="t1">Staked</div>
          <Value unit="DRF" b={drfBalanceArr[0]} s={`.${drfBalanceArr[1]}`} />
          <div className="t2" />
          <div className="desc">
            {$t("Earn-current-pool-size")} :
            <span className="v">{drfBalanceArr.join(".")}</span> DRF
          </div>
          <Button
            className="earn-btn"
            fill={true}
            text={$t("Stake")}
            click={() => {
              props.showModal('Stake DRF' )
            }}
          />
          <Button
            className="earn-btn earn-btn2"
            text={$t("Unstake")}
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
        t1={$t("bDRFPool")}
        t2={$t("bDRFPool1")}
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
            text={$t("Claim-All")}
            click={() => {
              console.log(111);
            }}
          />
          <Button
            className="earn-btn earn-btn2"
            text={$t("Exchange")}
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
            text={$t("Stake")}
            click={() => {
              props.showModal('Stake bDRF')
            }}
          />
          <Button
            className="earn-btn earn-btn2"
            text={$t("Unstake")}
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
