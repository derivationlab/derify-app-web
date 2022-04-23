import * as React from "react";
import "./index.less";

export interface TypeProps {
  t: "Long" | "Short";
  c: number;
}

export default function TradeType({ c, t }: TypeProps) {
  return (
    <span className={`trade-type ${t === "Short" ? "trade-type-s" : ""}`}>
      {t}
      <span className="type-inner">{c}x</span>
    </span>
  );
}
