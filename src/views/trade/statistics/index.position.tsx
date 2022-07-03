import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TradePosition, Empty } from "@/components/trade";
import closeImage from "@/assets/images/close2.png";
import { getUSDTokenName } from "@/config";
import { PositionView } from "@/utils/contractUtil";
import contractModel from "@/store/modules/contract";
import ModalClosePosition from "./closeModal";
import ModalCloseAllPosition from "../modal/cancelOrder";
import ProfitModal from "@/views/trade/modal/profit";
import { AppModel, RootStore } from "@/store";
import { message } from "antd";

const contractAction = contractModel.actions;

const Position = () => {
  const dispatch = useDispatch();
  const reloadTrade = useSelector((state: RootStore) => state.app.reloadDataStatus.trade);
  const tokenPairs = useSelector((state: RootStore) => state.contract.pairs);
  const userInfo = useSelector((state: RootStore) => state.user);
  // the modal for show the close position
  const [showModal, setShowModal] = useState(false);
  //  the modal for show the close all position
  const [showModalForCloseAll, setShowModalForCloseAll] = useState(false);
  // the close data
  const [closeData, setCloseData] = useState<PositionView>();
  const [list, setList] = useState<PositionView[]>([]);

  const [showProfitModal, setShowProfitModal] =  useState(false);
  const [profitData, setProfitData] = useState<PositionView>();

  const getPairByAddress = (token: string) => {
    return tokenPairs.find((pair) => pair.address === token) || { name: "unknown", key: "unknown" };
  };

  // the close all position method
  const closeAll = () => {
    const trader = userInfo.selectedAddress;
    const brokerId = userInfo.brokerId;
    if(trader && brokerId){
      const closePositionAction = contractModel.actions.closeAllPositions(trader, brokerId);
      setShowModalForCloseAll(false);
      closePositionAction(dispatch).then(() => {
        message.success("success");
        dispatch(AppModel.actions.updateTradeLoadStatus());
      }).catch((e) => {
        message.error("error");
      });
    }
  };

  const unit = getUSDTokenName();

  const fetchData = useCallback(() => {
    if (userInfo.selectedAddress) {
      const loadPositionDataAction = contractAction.loadPositionData(userInfo.selectedAddress);
      loadPositionDataAction(dispatch).then((res) => {
        if (res && res.length) {
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
            toggleModal={setShowModal}
            setData={setCloseData}
            unit={unit}
            key={item.tx}
            data={item}
            getPairByAddress={getPairByAddress}
            showProfitModal={(data:PositionView) => {
              setProfitData(data)
              setShowProfitModal(true)
            }}
          />
        ))
      }
      {
        list.length ? (
          <div className="close-all">
            <div className="btn" onClick={() => {setShowModalForCloseAll(true);}}>
              <span>CLOSE ALL</span>
              <img src={closeImage} alt="" />
            </div>
          </div>
        ) : (
          <Empty />
        )
      }
      {
        showModal && <ModalClosePosition
          data={closeData}
          title="close position"
          getPairByAddress={getPairByAddress}
          close={() => {
            setShowModal(false);
          }}
        />
      }
      {
        showModalForCloseAll && <ModalCloseAllPosition
          type="allPosition"
          close={() => {
            setShowModalForCloseAll(false);
          }}
          confirm={closeAll}
        />
      }
      {
        showProfitModal && (
          <ProfitModal
            unit={unit}
            getPairByAddress={getPairByAddress}
            position={profitData}
            close={() => {
              setShowProfitModal(false)
            }}
            confirm={() => {
              setShowProfitModal(false)
            }}
          />
        )
      }
    </div>
  );
};


export default Position;
