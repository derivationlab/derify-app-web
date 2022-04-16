import React from "react";
import "./index.less";

export default function Modal(props: any) {
  return (
    <div className={`modal-w ${props.className}`}>
      <div className="content">{props.children}</div>
    </div>
  );
}
