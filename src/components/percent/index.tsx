import * as React from "react";
import "./index.less";

interface PercentProps {
  className?: string;
  setValue: (n: number) => void;
  value?: number;
}

export default function Percent({ className, setValue, value }: PercentProps) {
  return (
    <div className={`percents ${className || ""}`}>
      <div className={`per ${value === 25 ? 'selected' : ''} `} onClick={() => setValue(25)}>25%</div>
      <div className={`per ${value === 50 ? 'selected' : ''} `} onClick={() => setValue(50)}>50%</div>
      <div className={`per ${value === 75 ? 'selected' : ''} `} onClick={() => setValue(75)}>75%</div>
      <div className={`per last ${value === 100 ? 'selected' : ''} `} onClick={() => setValue(100)}>100%</div>
    </div>
  );
}
