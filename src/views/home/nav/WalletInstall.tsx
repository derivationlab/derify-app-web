import React from 'react';
import MetaMaskOnboarding from '@metamask/onboarding';
import {Button, Col, Row} from "antd";
import {useIntl} from "react-intl";

const ONBOARD_TEXT = 'Click here to install MetaMask!';
const CONNECT_TEXT = 'Connect';
const CONNECTED_TEXT = 'Connected';

export const AppWalletInstall: React.FC = props => {
  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const onboarding = React.useRef<MetaMaskOnboarding>();
  const {formatMessage} = useIntl()

  function intl(id:string) {
    return formatMessage({id})
  }
  const $t = intl;

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

   React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        onboarding?.current?.stopOnboarding();
      }
    }
   }, [accounts]);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((newAccounts: []) => setAccounts(newAccounts));
    } else {
      onboarding?.current?.startOnboarding();
    }
  };

  if (MetaMaskOnboarding.isMetaMaskInstalled()) {
    return <div>{props.children}</div>
  } else {
    return (
      <Row gutter={[20,20]} justify={"center"}>
        <Col>
          <Button type={"primary"} disabled={isDisabled} onClick={onClick}>{$t('global.ClickToInstallWallet')}</Button>
        </Col>
      </Row>
    );
  }
};

export default AppWalletInstall;
