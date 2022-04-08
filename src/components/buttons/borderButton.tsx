import React, { ReactNode } from "react";
import "./borderButton.less";

export interface BorderButton {
  text: string | ReactNode;
  className?: string;
  click: () => void;
  icon?: any;
  fill?: boolean;
}

export default function BorderButton({
  icon,
  className,
  click,
  text,
  fill,
}: BorderButton) {
  return (
    <div className={`border-btn-wrapper ${className || ""}`} onClick={click}>
      <div
        className="border-btn"
        style={{
          textAlign: icon ? "inherit" : "center",
          background: fill ? 'inherit' : '#fff'
        }}
      >
        {icon && (
          <div className="icon">
            <img src={icon} />
          </div>
        )}
        {fill ? <div className="text">{text}</div> : <span>{text}</span>}
      </div>
    </div>
  );
}
