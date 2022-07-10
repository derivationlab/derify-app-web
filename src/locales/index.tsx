import React from 'react';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';

import { useSelector } from "react-redux";

import { RootStore } from '@/store/index'
import zh from './lang/zh-CN';
import en from './lang/en';

import enUS from 'antd/es/locale/en_US.js';
import zhCN from 'antd/es/locale/zh_CN.js';

const Locales: React.FC = ({ children }) => {
  const locale: string = useSelector((state: RootStore) => state.app.locale);
  const chooseLocale = (str: any) => {
    return str === 'en' ? en : zh
  }
  return <IntlProvider
    textComponent="span"
    key={locale}
    defaultLocale={locale}
    locale={locale}
    messages={chooseLocale(locale)}
  >
    <ConfigProvider
      locale={locale === 'en' ? enUS : zhCN}
    >
      {children}
    </ConfigProvider>
  </IntlProvider>
}


export default Locales;
