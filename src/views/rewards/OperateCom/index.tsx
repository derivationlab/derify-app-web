import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { Modal, Row, Col, Input, Button, Select } from "antd";
import { useIntl, FormattedMessage } from "react-intl";
import { ModalProps } from "antd/es/modal";
import {RewardsType} from "@/store/modules/reward";
import {BondAccountType, fromContractUnit, toContractUnit} from "@/utils/contractUtil";
import {useDispatch, useSelector} from "react-redux";
import {RewardModel, RootStore} from "@/store";
import {checkNumber, fck} from "@/utils/utils";
import ErrorMessage from "@/components/ErrorMessage";
import {DerifyTradeModal} from "@/views/CommonViews/ModalTips";

const { Option } = Select;

export enum OperateType{
  minWithdraw,
  eDRFWithdraw,
  eDRFRedeem,
  eDRFPledge,
  bDRFWithdraw,
  bDRFPledge,
  bDRFRedeem,
  bDRFExchange,
}

declare type RewardPopupLang = {
  title: string,
  amount: string,
  token: string,
  max: string,
  all: string,
  accountOptions?: {label: string, value: number}[],
  confirm: string,
  cancel: string,
}

interface OperateComProps extends ModalProps {
  type: OperateType;
  rewardsType: RewardsType;
  closeModal: () => void;
}

interface RenderModuleProps extends PropsWithChildren<any>{
  type: OperateType;
  typeLangKey: RewardPopupLang;
  closeModal: () => void;
}

const typeLangKeyMap:{[key:number]:RewardPopupLang} = {
  [OperateType.minWithdraw]:{
    title: 'Rewards.Mining.WithdrawPopup.title',
    amount: 'Rewards.Mining.WithdrawPopup.Amount',
    token: 'USDT',
    max: 'Rewards.Mining.WithdrawPopup.Max',
    all: 'Rewards.Mining.WithdrawPopup.All',
    confirm: 'Rewards.Mining.WithdrawPopup.Withdraw',
    cancel: 'Rewards.Mining.WithdrawPopup.Cancel',
  },
  [OperateType.eDRFWithdraw]:{
    title: 'Rewards.Staking.WithdrawPopup.title',
    amount: 'Rewards.Staking.WithdrawPopup.Amount',
    token: 'eDRF',
    max: 'Rewards.Staking.WithdrawPopup.Max',
    all: 'Rewards.Staking.WithdrawPopup.All',
    confirm: 'Rewards.Staking.WithdrawPopup.Withdraw',
    cancel: 'Rewards.Staking.WithdrawPopup.Cancel',
  },
  [OperateType.bDRFWithdraw]:{
    title: 'Rewards.Bond.WithdrawPopup.title',
    amount: 'Rewards.Bond.WithdrawPopup.Amount',
    token: 'bDRF',
    max: 'Rewards.Bond.WithdrawPopup.Max',
    all: 'Rewards.Bond.WithdrawPopup.All',
    confirm: 'Rewards.Bond.WithdrawPopup.Withdraw',
    cancel: 'Rewards.Bond.WithdrawPopup.Cancel',
  },
  [OperateType.eDRFRedeem]:{
    title: 'Rewards.Staking.RedeemPopup.title',
    amount: 'Rewards.Staking.RedeemPopup.Amount',
    token: 'DRF',
    max: 'Rewards.Staking.RedeemPopup.Max',
    all: 'Rewards.Staking.RedeemPopup.All',
    accountOptions:[
      // {label:'Rewards.Staking.RedeemPopup.DRFAccount',value: BondAccountType.DerifyAccount},
      {label:'Rewards.Staking.RedeemPopup.MyWallet',value: BondAccountType.WalletAccount},
    ],
    confirm: 'Rewards.Staking.RedeemPopup.Redeem',
    cancel: 'Rewards.Staking.RedeemPopup.Cancel',
  },
  [OperateType.eDRFPledge]:{
    title: 'Rewards.Staking.PledgePopup.title',
    amount: 'Rewards.Staking.PledgePopup.Amount',
    token: 'DRF',
    max: 'Rewards.Staking.PledgePopup.Max',
    all: 'Rewards.Staking.PledgePopup.All',
    accountOptions:[
      // {label:'Rewards.Staking.PledgePopup.DRFAccount',value: BondAccountType.DerifyAccount},
      {label:'Rewards.Staking.PledgePopup.MyWallet',value: BondAccountType.WalletAccount},
    ],
    confirm: 'Rewards.Staking.PledgePopup.Staking',
    cancel: 'Rewards.Staking.PledgePopup.Cancel',
  },
  [OperateType.bDRFExchange]:{
    title: 'Rewards.Bond.ExchangePopup.title',
    amount: 'Rewards.Bond.ExchangePopup.Amount',
    token: 'bDRF',
    max: 'Rewards.Bond.ExchangePopup.Max',
    all: 'Rewards.Bond.ExchangePopup.All',
    accountOptions:[
      {label:'Rewards.Bond.ExchangePopup.bDRFAccount',value: BondAccountType.DerifyAccount},
      {label:'Rewards.Bond.ExchangePopup.MyWallet',value: BondAccountType.WalletAccount},
    ],
    confirm: 'Rewards.Bond.ExchangePopup.Exchange',
    cancel: 'Rewards.Bond.ExchangePopup.Cancel',
  },
  [OperateType.bDRFPledge]:{
    title: 'Rewards.Bond.PledgePopup.title',
    amount: 'Rewards.Bond.PledgePopup.Amount',
    token: 'bDRF',
    max: 'Rewards.Bond.PledgePopup.Max',
    all: 'Rewards.Bond.PledgePopup.All',
    accountOptions:[
      {label:'Rewards.Bond.PledgePopup.bDRFAccount',value: BondAccountType.DerifyAccount},
      {label:'Rewards.Bond.PledgePopup.MyWallet',value: BondAccountType.WalletAccount},
    ],
    confirm: 'Rewards.Bond.PledgePopup.Staking',
    cancel: 'Rewards.Bond.PledgePopup.Cancel',
  },
  [OperateType.bDRFRedeem]:{
    title: 'Rewards.Bond.RedeemPopup.title',
    amount: 'Rewards.Bond.RedeemPopup.Amount',
    token: 'bDRF',
    max: 'Rewards.Bond.RedeemPopup.Max',
    all: 'Rewards.Bond.RedeemPopup.All',
    accountOptions:[
      {label:'Rewards.Bond.RedeemPopup.bDRFAccount',value: BondAccountType.DerifyAccount},
      {label:'Rewards.Bond.RedeemPopup.MyWallet',value: BondAccountType.WalletAccount},
    ],
    confirm: 'Rewards.Bond.RedeemPopup.Redeem',
    cancel: 'Rewards.Bond.RedeemPopup.Cancel',
  }
};

const RenderModule: React.FC<RenderModuleProps> = forwardRef(({ type, typeLangKey,closeModal },ref) => {

  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const trader = useSelector((state:RootStore) => state.user.selectedAddress);

  const rewardState = useSelector((state:RootStore) => state.reward);

  const [accountType, setAccountType] = useState<number>(typeLangKey.accountOptions ? typeLangKey.accountOptions[0].value : BondAccountType.DerifyAccount);
  const [amount, setAmount] = useState<string>("");
  const [errorMsg,setErrorMsg] = useState<any>("")

  function intl(id:string) {
    return formatMessage({id})
  }
  const $t = intl;

  const getMaxAmount = useCallback((rewardState, type, accountType = BondAccountType.DerifyAccount) => {
    if (type === OperateType.minWithdraw) {
      return rewardState.pmrBalance
    }

    if (type === OperateType.eDRFWithdraw) {
      return rewardState.edrfInfo.edrfBalance
    }

    if(type === OperateType.bDRFWithdraw){
      return rewardState.bondInfo.bondBalance
    }

    if(type === OperateType.eDRFRedeem){
      return rewardState.edrfInfo.drfBalance
    }

    if(type === OperateType.bDRFRedeem){
      return rewardState.bondInfo.bondReturnBalance
    }

    if(type === OperateType.eDRFPledge){
      if(accountType === BondAccountType.DerifyAccount){
        //TODO
        //return this.$store.state.earnings.bondInfo.bondBalance
        return 0
      }else{
        return rewardState.wallet.drfBalance
      }
    }

    if(type === OperateType.bDRFPledge){
      if(accountType === BondAccountType.DerifyAccount){
        return rewardState.bondInfo.bondBalance
      }else{
        return rewardState.wallet.drfBalance
      }
    }

    if(type === OperateType.bDRFExchange){
      return rewardState.exchangeBondSizeUpperBound
    }

    return 0
  }, [rewardState, type, accountType]);

  const onAmountChange = useCallback((val) => {

    const checkRet = checkNumber(val, fromContractUnit(getMaxAmount(rewardState, type, accountType)));

    if(checkRet.value !== null){
      setAmount(checkRet.value);
    }

    if(!checkRet.success){
      setErrorMsg($t('global.NumberError'))
    }else{
      setErrorMsg('')
    }
  }, [rewardState, type, accountType]);

  const updateMaxAmout = useCallback((trader:string,amount:string|number, bondAccountType) => {
    if(type === OperateType.bDRFExchange){
      const getExchangeBondSizeUpperBoundAction = RewardModel.actions.getExchangeBondSizeUpperBound(trader, amount, bondAccountType);
      getExchangeBondSizeUpperBoundAction(dispatch);
    }

    if([OperateType.eDRFPledge, OperateType.bDRFPledge].indexOf(type) > -1){
      if(bondAccountType === BondAccountType.WalletAccount) {

        const earningTokenMap:{[key:number]:string} = {}
        earningTokenMap[OperateType.eDRFPledge] = 'DRF'
        earningTokenMap[OperateType.bDRFPledge] = 'bDRF'
        const getWalletBalanceAction = RewardModel.actions.getWalletBalance(trader, earningTokenMap[type]);
        getWalletBalanceAction(dispatch);
      }
    }

    if([OperateType.eDRFPledge, OperateType.bDRFPledge].indexOf(type) > -1){
      if(bondAccountType === BondAccountType.WalletAccount) {

        const earningTokenMap:{[key:number]:string} = {}
        earningTokenMap[OperateType.eDRFPledge] = 'DRF'
        earningTokenMap[OperateType.bDRFPledge] = 'bDRF'
        const getWalletBalanceAction = RewardModel.actions.getWalletBalance(trader, earningTokenMap[type]);
        getWalletBalanceAction(dispatch);
      }
    }

  }, [accountType,type])

  const onAccountChange = useCallback((val) => {
    setAccountType(val);

    if(!trader){
      return;
    }

    updateMaxAmout(trader,amount, val);
  },[trader,amount, accountType]);

  const doAmountMax = useCallback((max:string) => {
    setAmount(max);
  }, []);

  const doSubmit = useCallback(() => {

    if(amount === ''){
      return;
    }

    const checkRet = checkNumber(amount, fromContractUnit(getMaxAmount(rewardState, type, accountType)));

    if(!checkRet.success){

      setErrorMsg($t('global.NumberError'))
      return;
    }

    if(!trader){
      return;
    }

    setErrorMsg('');

    const contractAmount = toContractUnit(amount);

    let doSubmitAction = null;
    if(type === OperateType.minWithdraw){
      doSubmitAction = RewardModel.actions.withdrawPMReward(trader, contractAmount);
    }

    if(type === OperateType.bDRFWithdraw){
      doSubmitAction = RewardModel.actions.withdrawBond(trader, contractAmount);
    }

    if(type === OperateType.eDRFWithdraw){
      doSubmitAction = RewardModel.actions.withdrawEdrf(trader, contractAmount);
    }

    if(type === OperateType.eDRFPledge){
      doSubmitAction = RewardModel.actions.stakingDrf(trader, contractAmount);
    }

    if(type === OperateType.bDRFPledge){
      doSubmitAction = RewardModel.actions.depositBondToBank(trader, contractAmount,accountType);
    }

    if(type === OperateType.eDRFRedeem){
      doSubmitAction = RewardModel.actions.redeemDrf(trader, contractAmount);
    }

    if(type === OperateType.bDRFRedeem){
      doSubmitAction = RewardModel.actions.redeemBondFromBank(trader, contractAmount, accountType);
    }

    if(type === OperateType.bDRFExchange){
      doSubmitAction = RewardModel.actions.exchangeBond(trader, contractAmount, accountType);
    }

    if(!doSubmitAction){
      return;
    }

    closeModal();
    DerifyTradeModal.pendding();
    doSubmitAction(dispatch).then(() => {
      DerifyTradeModal.success();
    }).catch((e) => {
      DerifyTradeModal.failed();
      console.error('doSubmitAction type', e)
    }).finally(() => {

    });

  }, [trader, type, amount, accountType]);

  useImperativeHandle(ref,() =>({
    submit: doSubmit
  }), [trader, type, amount, accountType]);

  useEffect(() => {
    setAmount('');

    if(typeLangKey.accountOptions){
      setAccountType(typeLangKey.accountOptions[0].value)
    }

  }, [typeLangKey]);


  switch (type) {
    case OperateType.minWithdraw:
    case OperateType.eDRFWithdraw:
    case OperateType.bDRFWithdraw:
      return (
        <>
          <ErrorMessage style={{margin: "10px 0"}} msg={errorMsg} visible={!!errorMsg} onCancel={() => setErrorMsg("")}/>
          <Row>
            <Col flex="100%" className="margin-b-m">
              <Row>{$t(typeLangKey.amount)}</Row>
            </Col>
            <Col flex="100%" className="margin-b-m">
              <Input size="large" addonAfter={typeLangKey.token} value={amount} onChange={({target:{value}})=>onAmountChange(value)} />
            </Col>
            <Col flex="100%">
              <Row justify="space-between" align="middle">
                <Col>{$t(typeLangKey.max)}：{fck(getMaxAmount(rewardState, type, accountType), -8, 4)} {typeLangKey.token}</Col>
                <Col>
                  <Button type="link" onClick={() => doAmountMax(fck(getMaxAmount(rewardState, type, accountType), -8, 4))}>{$t(typeLangKey.all)}</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      );
    case OperateType.bDRFRedeem:
    case OperateType.eDRFRedeem:
    case OperateType.bDRFPledge:
    case OperateType.eDRFPledge:
    case OperateType.bDRFExchange:
      return (
        <>
          <ErrorMessage style={{margin: "10px 0"}} msg={errorMsg} visible={!!errorMsg} onCancel={() => setErrorMsg("")}/>
          <Row>
            <Col flex="100%" className="margin-b-m">
              <Select
                      defaultActiveFirstOption
                      size="large"
                      getPopupContainer={(item) => item.parentNode}
                      onChange={(value) => onAccountChange(value)}
                      style={{ width: "100%" }}>
                {typeLangKey.accountOptions?.map((item) =>
                  <Option value={item.value} key={item.value}>{$t(item.label)}</Option>
                )}
              </Select>
            </Col>
            <Col flex="100%" className="margin-b-m">
              <Row>
                <FormattedMessage id={typeLangKey.amount} />
              </Row>
            </Col>
            <Col flex="100%" className="margin-b-m">
              <Input size="large" addonAfter={typeLangKey.token} value={amount} onChange={({target:{value}})=>onAmountChange(value)} />
            </Col>
            <Col flex="100%">
              <Row justify="space-between" align="middle">
                <Col>
                  <FormattedMessage id={typeLangKey.max} />
                  ：{fck(getMaxAmount(rewardState, type, accountType), -8, 4)} {typeLangKey.token}
                </Col>
                <Col>
                  <Button type="link" onClick={() => doAmountMax(fck(getMaxAmount(rewardState, type, accountType), -8, 4))}>
                    {$t(typeLangKey.all)}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      );
    default:
      return null;
  }
});

const OperateCom: React.FC<OperateComProps> = props => {
  const { formatMessage } = useIntl();
  const rewardModal = useRef<any>();
  const { type, rewardsType, ...modalProps } = props;

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl;

  const typeLangKey = typeLangKeyMap[type];

  const onModalSumit = useCallback(() => {
    if(rewardModal){
      rewardModal.current.submit();
    }

  }, []);

  const closeModal = () => {
    props.closeModal()
  }

  return (
    <Modal
      {...modalProps}
      title={formatMessage({ id: typeLangKey.title })}
      okText={$t(typeLangKey.confirm)}
      onOk={() => onModalSumit()}
      cancelText={$t(typeLangKey.cancel)}
    >
      <RenderModule closeModal={closeModal} typeLangKey={typeLangKey} type={type} ref={rewardModal}/>
    </Modal>
  );
};

export default OperateCom;
