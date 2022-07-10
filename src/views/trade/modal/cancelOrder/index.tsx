import * as React from "react";
import { ModalWithTitle } from "@/components/modal";
import { useIntl, FormattedMessage } from "react-intl";
import Button1 from "@/components/buttons/borderButton";
import "./index.less";

export interface CancelOrderProps {
  close: () => void;
  confirm: () => void;
  type: "order" | "allOrder" | "allPosition";
}

type DataItem = {
  title: string;
  content: string;
}

type DataMap = {
  [key: string]: DataItem
}
export default function CancelOrder(props: CancelOrderProps) {
  const { formatMessage } = useIntl();
  const $t = (id: string) => formatMessage({ id });
  const { confirm, type } = props;

  const dataMap: DataMap = {};
  dataMap["order"] = {
    title: "Cancel Order",
    content: "Do you want to cancel this order IMMEDIATELY ?",
  };
  dataMap["allOrder"] = {
    title: "Cancel All Order",
    content: "Do you want to cancel all order IMMEDIATELY ?",
  };
  dataMap["allPosition"] = {
    title: $t("closeAllp"),
    content: $t("closeAllp1")
  };


  return (
    <ModalWithTitle
      className="trade-cancel-order"
      title={dataMap[type].title}
      close={props.close}
    >
      <div className="text">{dataMap[type].content}</div>
      <div className="btn">
        <Button1
          text={$t("Trade.Wallet.Confirm")}
          click={confirm}
          fill={true}
          className="cancel-order-btn"
        />
      </div>
    </ModalWithTitle>
  );
}
