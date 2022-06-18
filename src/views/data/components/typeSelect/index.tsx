import React, { useState } from "react";
import { Input } from "antd";
import arrow from "@/assets/images/arrowd.png";
import arrow1 from "@/assets/images/arrow1.png";
import search from "@/assets/images/search.png";
import "./index.less";

export interface ITypeSelectProps {
  onChange: any;
  options: any;
}

export default function TypeSelect(props: ITypeSelectProps) {
  const [time, setTime] = useState<string>(props.options[0].label);
  const [open, setOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  return (
    <div className="data-type-select">
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
            <div className="search">
              <img src={search} alt="" />
              <Input
                placeholder="Search derivatives"
                onChange={(e: any) => {
                  setText(e.target.value);
                  console.log(text);
                }}
              />
            </div>
            {props.options
              .filter((e: any) => e.label.includes(text))
              .map((item: any) => {
                return (
                  <div
                    className={`option ${
                      item.label === time ? "selected" : ""
                    }`}
                    key={item.label}
                    onClick={() => {
                      setTime(item.label);
                      props.onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
