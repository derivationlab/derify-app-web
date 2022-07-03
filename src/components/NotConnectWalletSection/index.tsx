import React, { FC } from "react";

import './index.less'

import ConnectWalletButton from '@/components/ConnectWalletButton'

const NotConnectWalletSection: FC = () => {
  return (
    <div className="web-not-connect-wallet-section">
      <ConnectWalletButton />
    </div>
  )
}
export default NotConnectWalletSection
