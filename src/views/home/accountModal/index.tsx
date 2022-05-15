/**
 * @title the wallet modal
 */
import React from "react";
import { useDispatch } from "react-redux";
import close from "@/assets/images/close.png";
import Button from "@/components/buttons/borderButton";
import Notice from "@/components/notice";
import Modal from "@/components/modal";
import { UserModel } from "@/store";
import "./index.less";

export default function AccountModal(
  props: {
    close: any,
    setType: any,
    setAddr: any,
    show: any,
  })
{
  const dispatch = useDispatch();
  return (
    <Modal className="account-modal">
      <div className="title">
        Account<img src={close} alt="" onClick={props.close} />
      </div>
      <div className="list">
        <div className="t">
          Margin Balance <Notice title="Margin Balance" />
        </div>
        <div className="num1">
          <span className="big-num">891,234</span>
          <span className="small-num">.23</span>
          <span className="unit">USDT</span>
        </div>
        <div className="t t1">
          Available Margin Balance <Notice title="Available Margin Balance" />
        </div>
        <div className="num1">
          <span className="big-num">891,234</span>
          <span className="small-num">.23</span>
          <span className="unit">USDT</span>
        </div>
        <div className="btns">
          <Button
            click={() => {
              props.setType('deposit');
              props.setAddr('deposit addr');
              props.show(true);
              props.close()
            }}
            fill={true}
            className="deposit"
            text="Deposit"
          />
          <Button
            click={() => {
              props.setType('withdaw');
              props.setAddr('');
              props.show(true);
              props.close()
            }}
            className="withdaw"
            text="Withdaw"
          />
        </div>
        <div className="addr">0x40d276e6a7C80562BB1848e3ACB7B7629234C5a6</div>
        <div className="tag">MetaMask @ BNB Chain</div>
      </div>

      <Button
        click={() => {
          props.close();
          dispatch(UserModel.actions.logout());
        }}
        className="disconnect"
        text="Disconnect"
      />
    </Modal>
  );
}


