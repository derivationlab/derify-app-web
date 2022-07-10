import * as React from "react";
import "./index.less";
import { SideEnum as TradeTypes } from "@/utils/contractUtil";
import { useIntl, FormattedMessage } from "react-intl";

export interface TypeProps {
  t: "Long" | "Short" | "2-Way";
  c?: number;
  showL?: boolean
}

const classMap: any = {};
classMap["Long"] = "";
classMap["Short"] = "trade-type-s";
classMap["2-Way"] = "trade-type-2";

export default function TradeType({ c, t, showL=true }: TypeProps) {
  const { formatMessage } = useIntl();
  const $t = (id: string) => formatMessage({ id });
  let str = "";
  if(t === 'Long'){
    str = "Long"
  }else if(t === 'Short'){
    str = "Short"
  }else {
    str = '2way'
  }
  return (
    <>
      {c === undefined ? (
        <span className={`trade-type trade-type-simple ${classMap[t]}`}>
          {$t(`Trade.MyPosition.List.${str}`)}
        </span>
      ) : (
        <span className={`trade-type ${classMap[t]}`}>
               {$t(`Trade.MyPosition.List.${str}`)}
          <span className="type-inner">{c}{showL ? 'x': null}</span>
        </span>
      )}
    </>
  );
}
