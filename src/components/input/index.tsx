/**
 * @title 圆边input组件
 */
import React, { useState } from "react";
import arrow from "@/assets/images/arrowd.png";
import "./index.less";

interface InputProps {
  onChange: (e: any) => void;
  changeType?: any;
  btnName?: string;
  btnClick?: () => void;
  value: string;
  unit: string | Array<any>;
  label?: string;
  className?: string;
}

const Input: React.FunctionComponent<InputProps> = (props) => {
  const { value, label, btnName, btnClick, onChange, unit, className,changeType } = props;
  const [type, setType] = useState(0);
  const [show, setShow] = useState(false);
  return (
    <div className={`round-input-wrapper ${className || ""}`}>
      {label && <div className="label">{label}</div>}
      <div className="round-input">
        <input type="text" value={value} onChange={onChange} />
        {btnName ? (
          <div className="extras">
            <span className="unit">{unit}</span>
            <span className="btn" onClick={btnClick}>
              {btnName}
            </span>
          </div>
        ) : (
          Array.isArray(unit) ? (
              <div className="extra extra-list" onClick={() => {
                setShow(!show)
              }}>
                <span className="name">{unit[type]}</span>
                <img src={arrow}/>
              </div>
          ) : <div className="extra">
            <span className="name">{unit}</span>
          </div>
        )}
      </div>
      {
        Array.isArray(unit) && show && (
          <div className="type-list">
            {
              unit.map((item, index) => (
                <div className="name" key={item} onClick={() => {
                  setShow(false)
                  setType(index)
                  changeType(item)
                }}>{item}</div>
              ))
            }
          </div>
        )
      }
    </div>
  );
};

export default Input;
