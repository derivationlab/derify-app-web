import React, { useState, useEffect } from "react";
import "./index.less";

export interface ICheckBoxProps {
  title?: string;
  checked: boolean;
  onChange: any;
}

function CheckBox({ title, checked, onChange }: ICheckBoxProps) {
  return (
    <div className={`deri-checkbox ${checked ? "deri-checkbox-checked" : ""}`}>
      <div
        className="box"
        onClick={() => {
          onChange(!checked);
        }}
      ></div>
      {title && <div className="text">{title}</div>}
    </div>
  );
}

export default CheckBox;
