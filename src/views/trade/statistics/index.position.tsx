import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppModel, RootStore } from "@/store";
import { TradePosition } from "@/components/trade";
import closeImage from "@/assets/images/close2.png";
import { getUSDTokenName } from "@/config";
import { fromContractUnit, PositionView, SideEnum } from "@/utils/contractUtil";
import contractModel from "@/store/modules/contract";
import { amountFormt, fck } from "@/utils/utils";
import ModalClosePosition from "../modal/closePosition";

const contractAction = contractModel.actions;

const Position = () => {
  const dispatch = useDispatch();
  const reloadTrade = useSelector((state:RootStore) => state.app.reloadDataStatus.trade)
  const tokenPairs = useSelector((state: RootStore) => state.contract.pairs);
  const userInfo = useSelector((state:RootStore) => state.user);
  // the modal for show the close position
  const [showModal, setShowModal] = useState(false);
  // the close data
  const [closeData, setCloseData] = useState<PositionView>();
  const [list, setList] = useState<PositionView[]>([]);

  const getPairByAddress = (token: string) => {
    return tokenPairs.find((pair) => pair.address === token) || { name: "unknown", key: "unknown" };
  };

  const closeAll = () => {
    console.log("closeAll");
  };

  const unit = getUSDTokenName();

  const fetchData = useCallback(() => {
    if (userInfo.selectedAddress) {
      const loadPositionDataAction = contractAction.loadPositionData(userInfo.selectedAddress);
      loadPositionDataAction(dispatch).then((res) => {
        if(res && res.length){
          const positions: PositionView[] = [];
          res.forEach(position => {
            position.positionData?.positions.forEach((positionView: PositionView) => {
              positionView.tx = "tx" + positions.length;
              positions.push(positionView);
            });
          });
          setList(positions);
        }
      }).catch(e => {
        console.log(e);
      });
    }
  }, [userInfo.tradeDataTick]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (reloadTrade) {
      fetchData();
    }
  }, [reloadTrade]);

  useEffect(() => {
    const priceChangeAction = contractAction.onPriceChange(userInfo.trader, fetchData);
    priceChangeAction(dispatch);
  }, []);

  return (
    <div className="pos-list">
      {
        list.map(item => (
          <TradePosition
            unit={unit}
            key={item.tx}
            data={item}
            getPairByAddress={getPairByAddress}
          />
        ))
      }
      {
        list.length && (
          <div className="close-all">
            <div className="btn" onClick={closeAll}>
              <span>CLOSE ALL</span>
              <img src={closeImage} alt="" />
            </div>
          </div>
        )
      }
      {
        showModal && <ModalClosePosition
          operate="select"
          data={{
            token: {
              name: "token",
            },
          }}
          type="Short"
          title="close position"
          close={() => {
            console.log("close");
          }}
          confirm={() => {
            console.log("close");
          }}
        />
      }
    </div>
  );
};


export default Position;
