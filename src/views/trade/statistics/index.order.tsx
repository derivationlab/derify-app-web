import React, { useCallback, useEffect, useState } from "react";
import { TradeOrder, Empty } from "@/components/trade";
import { useDispatch, useSelector } from "react-redux";
import contractModel, {OrderPositionData, PositioData} from "@/store/modules/contract";
import { CancelOrderedPositionTypeEnum, fromContractUnit, OrderTypeEnum, PositionView } from "@/utils/contractUtil";
import {AppModel, RootStore} from "@/store";
import ModalCloseAll from "../modal/cancelOrder";
import closeImage from "@/assets/images/close2.png";
import { getUSDTokenName } from "@/config";
import { message } from "antd";

const Order = () => {
  const dispatch = useDispatch();
  const walletInfo = useSelector((state:RootStore) => state.user);
  const tokenPairs = useSelector((state:RootStore) => state.contract.pairs);
  const reloadTrade = useSelector((state:RootStore) => state.app.reloadDataStatus.trade)
  const getPairByAddress = (token: string) => {
    return tokenPairs.find((pair) => pair.address === token) || { name: "unknown", key: "unknown" };
  };
  const [dataSource, setDataSource] = useState<OrderPositionData[]>([]);
  const [showCloseAll, setShowCloseAll] = useState(false);
  const [showClose, setShowClose] = useState(false);

  const loadMyPositionData = useCallback(() => {
    const trader = walletInfo.selectedAddress
    if(trader){
      const loadPositionDataAction = contractModel.actions.loadPositionData(trader)
      loadPositionDataAction(dispatch).then((rows) => {
        if(Array.isArray(rows)){
          const positions:OrderPositionData[] = [];
          rows.forEach(position => {
            position.positionData?.orderPositions.forEach((positionView:OrderPositionData) => {
              positionView.tx = "tx" + positions.length
              positions.push(positionView)
            })
          })
          setDataSource(positions)
        }
      })
    }
  }, [walletInfo.tradeDataTick]);

  useEffect(() => {
    const priceChangeAction = contractModel.actions.onPriceChange(walletInfo.trader, () => {
      loadMyPositionData();
    });
    priceChangeAction(dispatch);
  }, []);

  useEffect(() => {
    loadMyPositionData()
  }, [loadMyPositionData]);

  useEffect(() => {
    if(reloadTrade){
      loadMyPositionData()
    }
  }, [reloadTrade]);

  const confirmCloseAll = () => {
    setShowCloseAll(false);
    const trader = walletInfo.selectedAddress;
    if(!trader) {
      return
    }
    const cancelAllOrderAction = contractModel.actions.cancleAllOrderedPositions(trader)
    cancelAllOrderAction(dispatch).then(() => {
      message.success("success")
      setShowCloseAll(false)
      dispatch(AppModel.actions.updateTradeLoadStatus());
    }).catch(e => {
      message.error("failed")
    })
  }

  const cancelOne = () => {
    // @ts-ignore
    const order = window.cancelOrder;
    const trader = walletInfo.selectedAddress;
    if (!trader) {
      return;
    }
    let closeType = 0;
    if (order.orderType === OrderTypeEnum.LimitOrder) {
      closeType = CancelOrderedPositionTypeEnum.LimitedOrder;
    }
    if (order.orderType === OrderTypeEnum.StopLossOrder) {
      closeType = CancelOrderedPositionTypeEnum.StopLossOrder;
    }
    if (order.orderType === OrderTypeEnum.StopProfitOrder) {
      closeType = CancelOrderedPositionTypeEnum.StopProfitOrder;
    }
    const params = {
      trader,
      token: order.token,
      closeType: closeType,
      side: order.side,
      timestamp: order.timestamp,
    };
    const cancelAllOrderAction = contractModel.actions.cancleOrderedPosition(params);
    cancelAllOrderAction(dispatch).then(() => {
      message.success("success")
      setShowClose(false)
      dispatch(AppModel.actions.updateTradeLoadStatus());
    }).catch(e => {
      message.error("failed")
    });
  };

  return (
    <div className="order-list">
      {
        dataSource.map(item => (
          <TradeOrder
            getPairByAddress={getPairByAddress}
            key={item.tx}
            data={item}
            unit={getUSDTokenName()}
            check={() => {
              setShowClose(true);
            }}
          />
        ))
      }
      {
        dataSource.length ? (
          <div className="close-all">
            <div className="btn" onClick={() => {setShowCloseAll(true)}}>
              <span>CLOSE ALL</span>
              <img src={closeImage} alt="" />
            </div>
          </div>
        ) : (
          <Empty />
        )
      }
      {
        showCloseAll && (
          <ModalCloseAll
            type='allOrder'
            confirm={confirmCloseAll}
            close={() => {
              setShowCloseAll(false)
            }}/>
        )
      }
      {
        showClose && (
          <ModalCloseAll
            type='order'
            confirm={cancelOne}
            close={() => {
              setShowClose(false)
            }}/>
        )
      }
    </div>
  )
}


export default Order;
