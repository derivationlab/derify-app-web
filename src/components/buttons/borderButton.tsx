import React, { ReactNode } from "react";
import "./borderButton.less";

export interface BorderButton {
  text: string | ReactNode;
  className?: string;
  click: () => void;
  icon?: any;
}

export default function BorderButton({
  icon,
  className,
  click,
  text,
}: BorderButton) {
  return (
    <div className={`border-btn-wrapper ${className || ""}`} onClick={click}>
      <div
        className="border-btn"
        style={{
          textAlign: icon ? "inherit" : "center",
        }}
      >
        {icon && (
          <div className="icon">
            <img src={icon} />
          </div>
        )}
        <span>{text}</span>
      </div>
    </div>
  );
}
