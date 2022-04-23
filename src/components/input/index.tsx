/**
 * @title 圆边input组件
 */
import React from "react";
import "./index.less";

interface InputProps {
  onChange: (e: any) => void;
  btnName?: string;
  btnClick?: () => void;
  value: string;
  unit: string;
  label?: string;
  className?: string;
}

const Input: React.FunctionComponent<InputProps> = ({
  value,
  label,
  btnName,
  btnClick,
  onChange,
  unit,
  className,
}) => {
  return (
    <div className={`round-input-wrapper ${className || ""}`}>
      {label && <div className="label">{label}</div>}
      <div className="round-input">
        <input type="text" value={value} onChange={onChange} />
        <div className="extra">
          <span className="name">{unit}</span>
          {btnName && (
            <span className="operate" onClick={btnClick}>
              {btnName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Input;
