import React from "react";
import { Tooltip } from "antd";
import notice from "@/assets/images/notice.png";

export default function Notice(props: { title: string }) {
  return (
    <Tooltip title={props.title} overlayClassName="global-tooltip-light">
      <img src={notice} alt="" />
    </Tooltip>
  );
}
