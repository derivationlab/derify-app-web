import React from "react";
import close from "@/assets/images/close.png";
import "./index.less";

interface ModalProps {
  className: string;
  children: React.ReactNode;
}

export default function Modal(props: ModalProps) {
  return (
    <div className={`modal-w ${props.className}`}>
      <div className="content">{props.children}</div>
    </div>
  );
}

interface ModalWithTitleProps {
  className: string;
  children: React.ReactNode;
  title: string;
  close: any;
}

export function ModalWithTitle(props: ModalWithTitleProps) {
  return (
    <Modal
      className={props.className}
      children={
        <>
          <div className="title">
            {props.title}
            <img src={close} alt="" onClick={props.close} />
          </div>
          {props.children}
        </>
      }
    />
  );
}
