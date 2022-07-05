import { isEmpty } from "lodash";
import React, { FC, useCallback, useEffect, useState } from "react";
import { Input } from "antd";
import {
  BrokerInfo,
  getBrokerByBrokerId,
  getBrokerByTrader,
  updateBroker,
} from "@/api/broker";
import ErrorMessage from "@/components/ErrorMessage";
import CheckBox from "@/components/checkbox";
import Button from "@/components/buttons/borderButton";
import tg from "@/assets/images/social/tg2.png";
import discord from "@/assets/images/social/discord2.png";
import reddit from "@/assets/images/social/reddit2.png";
import twitter from "@/assets/images/social/twitter2.png";
import wechat from "@/assets/images/social/wechat2.png";

const { TextArea } = Input;

interface Props {
  onConfirm: () => void
  onCancel: () => void
}

let logo: any = null;

const Step3: FC<Props> = () => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errMessage, setErrMessage] = useState<string>("");

  const onFileChangeEv = (e: any) => {
    const files = e.target.files;
    if (files.length) {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) {
        setErrMessage("the file size can not bigger than 2 M");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        logo = e.target.result;
      };
    }
  };

  const isUsableBroker = async (id: string): Promise<boolean> => {
    const response = await getBrokerByBrokerId(id);
    if (response && response.id && response.broker.toUpperCase() !== formValues?.broker.toUpperCase()) {
      setErrMessage("Your Code is occupied, choose another one.");
      return false;
    }
    return true;
  };

  const formValuesChangeCb = useCallback((key: string, value: string | boolean) => {
    setFormValues((val) => ({ ...val, [key]: value }));
  }, []);

  const onConfirmFormCb = useCallback(async () => {
    const {
      broker,
      name,
      introduction,
      address,
    } = formValues;
    const _broker = broker?.trim();
    const _name = name?.trim();
    const _introduction = introduction?.trim();
    const _address = address?.trim();
    if (
      isEmpty(_broker)
      || isEmpty(_name)
      || isEmpty(_introduction)
      || isEmpty(_address)
    ) {
      setErrMessage("Information is incomplete, please re-check.");
      return;
    }

    if (!/^[0-9a-zA-Z_@$]+$/.test(_address)) {
      setErrMessage("Only support letters, numbers and symbols '_ ',' @ ',' $'");
      return;
    }

    const usable = await isUsableBroker(_address);
    if (!usable) return;

    updateBroker({
      broker,
      name,
      introduction,
      id: address,
      logo: "",
    })
      .then(({ success, msg }) => {
        if (success) {
          // todo
        } else {
          setErrMessage(msg);
        }
      })
      .catch(e => {
        setErrMessage("Error, please retry.");
      });
  }, [formValues]);

  useEffect(() => {
    console.info(formValues);
  }, [formValues]);

  return (
    <div className="not-a-broker-register">
      <ErrorMessage
        msg={errMessage}
        style={{ margin: "10px 0" }}
        visible={!!errMessage}
        onCancel={() => setErrMessage("")}
      />

      <div className="t">Register for broker</div>

      {/* Account */}
      <div className="input-wrapper">
        <label>Account</label>
        <Input
          placeholder="Account"
          value={formValues?.broker}
          onChange={e => formValuesChangeCb("broker", e.target.value)}
        />
        <div className="desc">
          <span>Letters and numbers and "_" are accepted.</span>
          <span className="note">
              This is your broker code which you should share to your trader.
            </span>
        </div>
      </div>
      {/* Name */}
      <div className="input-wrapper">
        <label>Name</label>
        <Input
          placeholder="Name"
          value={formValues?.name}
          onChange={e => formValuesChangeCb("name", e.target.value)}
        />
        <div className="desc">
          <span>Letters and numbers and "_" are accepted.</span>
        </div>
      </div>
      {/* Logo */}
      <div className="input-wrapper input-wrapper-upload">
        <label>Logo</label>
        <div className="upload">
          <input type="file" onChange={onFileChangeEv} />
        </div>
      </div>
      {/* Address */}
      <div className="input-wrapper">
        <label>Address</label>
        <Input
          placeholder="Address"
          value={formValues?.address}
          onChange={e => formValuesChangeCb("address", e.target.value)} />
      </div>
      {/* Language */}
      <div className="input-wrapper input-wrapper-langs">
        <label>Language</label>
        <div className="langs">
          <div className="line line1">
            <CheckBox
              title="English"
              checked={formValues?.en}
              onChange={(v: boolean) => formValuesChangeCb("en", v)}
            />
            <CheckBox
              title="中文简体"
              checked={formValues?.cn}
              onChange={(v: boolean) => formValuesChangeCb("cn", v)}
            />
            <CheckBox
              title="繁體中文"
              checked={formValues?.tw}
              onChange={(v: boolean) => formValuesChangeCb("tw", v)}
            />
          </div>
          <div className="line">
            <CheckBox
              title="Ру́сский"
              checked={formValues?.russia}
              onChange={(v: boolean) => formValuesChangeCb("russia", v)}
            />
            <CheckBox
              title="Tiếng Việt"
              checked={formValues?.germany}
              onChange={(v: boolean) => formValuesChangeCb("germany", v)}
            />
            <CheckBox
              title="Français"
              checked={formValues?.france}
              onChange={(v: boolean) => formValuesChangeCb("france", v)}
            />
          </div>
        </div>
      </div>
      {/* Telegram */}
      <div className="input-wrapper input-wrapper-c">
        <label>Community</label>
        <div className="icon">
          <img src={tg} alt="" />
        </div>
        <div className="name">Telegram</div>
        <Input
          placeholder="Telegram"
          value={formValues?.telegram}
          onChange={e => formValuesChangeCb("telegram", e.target.value)} />
      </div>
      {/* Discord */}
      <div className="input-wrapper input-wrapper-c">
        <label />
        <div className="icon">
          <img src={discord} alt="" />
        </div>
        <div className="name">Discord</div>
        <Input
          placeholder="Discord"
          value={formValues?.discord}
          onChange={e => formValuesChangeCb("discord", e.target.value)} />
      </div>
      {/* Twitter */}
      <div className="input-wrapper input-wrapper-c">
        <label />
        <div className="icon">
          <img src={twitter} alt="" />
        </div>
        <div className="name">Twitter</div>
        <Input
          placeholder="Twitter"
          value={formValues?.twitter}
          onChange={e => formValuesChangeCb("twitter", e.target.value)} />
      </div>
      {/* Reddit */}
      <div className="input-wrapper input-wrapper-c">
        <label />
        <div className="icon">
          <img src={reddit} alt="" />
        </div>
        <div className="name">Reddit</div>
        <Input
          placeholder="Reddit"
          value={formValues?.reddit}
          onChange={e => formValuesChangeCb("reddit", e.target.value)} />
      </div>
      {/* WeChat */}
      <div className="input-wrapper input-wrapper-c">
        <label />
        <div className="icon">
          <img src={wechat} alt="" />
        </div>
        <div className="name">WeChat</div>
        <Input
          placeholder="WeChat"
          value={formValues?.weChat}
          onChange={e => formValuesChangeCb("weChat", e.target.value)} />
      </div>
      {/* Introduction */}
      <div className="input-wrapper input-wrapper-a">
        <label>Introduction</label>
        <TextArea
          rows={4}
          value={formValues?.introduction}
          onChange={e => formValuesChangeCb("introduction", e.target.value)} />
        <div className="desc">
          <span>Less than 500 characters.</span>
        </div>
      </div>

      <div className="btns">
        <Button
          fill
          text="Confirm"
          className="btn1"
          click={onConfirmFormCb}
        />
        <Button text="Cancel" className="btn2" click={null} />
      </div>
    </div>
  );
};

export default Step3;
