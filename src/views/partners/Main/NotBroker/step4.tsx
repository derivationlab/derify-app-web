import React from "react";
import Button from "@/components/buttons/borderButton";

export default function Step4(props: { confirm: any }) {
  return (
    <div className="not-a-broker-success">
      <div className="content">
        <div className="line1">Congratulation!</div>
        <div className="line2">Your broker privilege is ready!</div>
        <div className="line3">
          <Button
            text="Confirm"
            fill={true}
            className="btn1"
            click={props.confirm}
          />
        </div>
      </div>
    </div>
  );
}
