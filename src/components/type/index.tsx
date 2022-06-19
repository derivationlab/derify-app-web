import * as React from "react";
import "./index.less";

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
  return (
    <>
      {c === undefined ? (
        <span className={`trade-type trade-type-simple ${classMap[t]}`}> {t}</span>
      ) : (
        <span className={`trade-type ${classMap[t]}`}>
          {t}
          <span className="type-inner">{c}{showL ? 'x': null}</span>
        </span>
      )}
    </>
  );
}
