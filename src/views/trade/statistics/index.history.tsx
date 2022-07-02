import React, { useCallback, useEffect, useState } from "react";
import { TradeHistory, Empty } from "@/components/trade";
import { Pagination } from "antd";
import { getTradeList, TradeRecord } from "@/api/trade";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@/store";
import { amountFormt, dateFormat } from "@/utils/utils";
import { Pagenation } from "@/api/types";
import contractModel from "@/store/modules/contract";
import { getUSDTokenName } from "@/config";

const History = () => {
  const dispatch = useDispatch();
  const walletInfo = useSelector((state: RootStore) => state.user);
  const tokenPairs = useSelector((state: RootStore) => state.contract.pairs);
  const reloadTrade = useSelector((state: RootStore) => state.app.reloadDataStatus.trade);
  const [pagenation, setPageData] = useState<Pagenation>(new Pagenation());

  const getPairByAddress = (token: string) => {
    return tokenPairs.find((pair) => pair.address === token) || { name: "unknown", key: "unknown" };
  };

  useEffect(() => {
    const trader = walletInfo.selectedAddress;
    if (!trader) {
      pagenation.records = [];
      pagenation.totalItems = 0;
      pagenation.current = 1;
      setPageData(pagenation);
      return;
    }
    getTradeList(trader, pagenation.current, pagenation.pageSize).then((pagenation: Pagenation) => {
      setPageData(pagenation);
    }).catch(e => {
      console.log("getTradeList", e);
    });
  }, [pagenation.current, pagenation.pageSize, walletInfo]);

  const loadTradeList = useCallback(() => {
    const trader = walletInfo.selectedAddress;
    if (!trader || !reloadTrade) {
      return;
    }
    getTradeList(trader, pagenation.current, pagenation.pageSize).then((pagination: Pagenation) => {
      setPageData(pagination);
    }).catch(e => {
      console.log(e);
    });
  }, [reloadTrade]);

  useEffect(loadTradeList, [reloadTrade]);

  useEffect(() => {
    const priceChangeAction = contractModel.actions.onPriceChange(walletInfo.trader, () => {
      loadTradeList();
    });
    priceChangeAction(dispatch);
  }, []);

  const onPageChange = useCallback((pageNum, pageSize) => {
    pagenation.current = pageNum;
    if (pageSize) {
      pagenation.pageSize = pageSize;
    }
    setPageData(pagenation);
  }, []);

  return (
    <div className="history-list">
      {
        pagenation.records.map((item, index) =>
          <TradeHistory key={index} data={item} getPairByAddress={getPairByAddress} unit={getUSDTokenName()}/>)
      }
      {
        pagenation.records.length ? (
          <Pagination
            pageSize={pagenation.pageSize}
            onChange={onPageChange}
            current={pagenation.current}
            total={pagenation.totalItems}
            showSizeChanger={false}
          />
        ) : (
          <Empty/>
        )
      }
    </div>
  );
};


export default History;
