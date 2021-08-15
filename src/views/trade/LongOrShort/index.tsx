import React, { useEffect, useState ,memo} from "react";
import classNames from "classnames";
import "./index.less";

interface LongOrShortProps {
  power: number;
  value: string;
}

const initState = (val: string) => {
  return val.indexOf("+")!==-1 ? "long" : "short";
};

const LongOrShort: React.FC<LongOrShortProps> = ({ value, power }) => {
  const [val, setValue] = useState(initState(value));

  useEffect(() => {
    setValue(initState(value));

  }, [value]);
  
  return (
    <div className={classNames(["long-or-short", val])}>
      <span>{(val === "long" && "多") || "空"}</span>
      <span>{power + "x"}</span>
    </div>
  );
};

export default memo(LongOrShort);
