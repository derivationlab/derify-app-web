import React, { useState } from "react";
import arrow from "@/assets/images/arrowd.png";
import arrow1 from "@/assets/images/arrow1.png";
import "./index.less";

export interface ITimeSelectProps {
  onChange: any;
}

const times = ["1D", "7D", "1M", "YDT"];

export default function TimeSelect(props: ITimeSelectProps) {
  const [time, setTime] = useState<string>("1D");
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="time-select">
      <div
        className={`select ${open ? "active" : ""}`}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <span className="val">{time}</span>
        <img src={arrow} alt="" className="close-icon" />
        <img src={arrow1} alt="" className="open-icon" />
      </div>
      <div className="list">
        {open && (
          <div className="options">
            {times.map(item => {
              return (
                <div
                  className={`option ${item === time ? "selected" : ""}`}
                  key={item}
                  onClick={() => {
                    setTime(item);
                    props.onChange(item);
                    setOpen(false);
                  }}
                >
                  {item}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
