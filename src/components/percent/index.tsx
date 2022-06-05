import * as React from "react";
import "./index.less";

interface PercentProps {
  className?: string;
  setValue: (n: number) => void;
}

export default function Percent({ className, setValue }: PercentProps) {
  return (
    <div className={`percents ${className || ""}`}>
      <div className="per" onClick={() => setValue(25)}>25%</div>
      <div className="per" onClick={() => setValue(50)}>50%</div>
      <div className="per" onClick={() => setValue(75)}>75%</div>
      <div className="per last" onClick={() => setValue(100)}>100%</div>
    </div>
  );
}
