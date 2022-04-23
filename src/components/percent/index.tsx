import * as React from "react";
import "./index.less";

export interface PercentProps {
  className?: string;
}

export default function Percent({ className }: PercentProps) {
  return (
    <div className={`percents ${className || ""}`}>
      <div className="per">25%</div>
      <div className="per">50%</div>
      <div className="per">75%</div>
      <div className="per last">100%</div>
    </div>
  );
}
