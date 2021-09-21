import React from "react";
import {Button} from "antd";
import './ModalTips.less';
import {useIntl} from "react-intl";
import {RootStore, UserModel} from "@/store";
import {useDispatch, useSelector} from "react-redux";

declare interface ButtonWrapperProps extends React.PropsWithChildren<any>{
}

const WalletConnectButtonWrapper : React.FC<ButtonWrapperProps> = ({children,...props}) => {
  const dispatch = useDispatch();
  const {isLogin} = useSelector((state:RootStore) => state.user);

  const { formatMessage } = useIntl();

  function intl<T>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl;

  return (
    <>
      {isLogin ? children :<Button {...props} onClick={() => dispatch(UserModel.actions.showWallet())}>{$t("Trade.Wallet.ConnectWallet")}</Button>}
    </>
  );
};
export default WalletConnectButtonWrapper;
