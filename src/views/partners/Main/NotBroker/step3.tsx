import React from "react";
import { Input } from "antd";
import CheckBox from "@/components/checkbox";
import Button from "@/components/buttons/borderButton";
import tg from "@/assets/images/social/tg2.png";
import discord from "@/assets/images/social/discord2.png";
import reddit from "@/assets/images/social/reddit2.png";
import twitter from "@/assets/images/social/twitter2.png";
import wechat from "@/assets/images/social/wechat2.png";
const { TextArea } = Input;

interface Step3Props {
  confirm: any;
  cancel: any;
}

interface Step3State {
  en: boolean;
  cn: boolean;
  tw: boolean;
  russia: boolean;
  germany: boolean;
  france: boolean;
}

class Step3 extends React.Component<Step3Props, Step3State> {
  constructor(props: Step3Props) {
    super(props);
    this.state = {
      en: true,
      cn: false,
      tw: false,
      russia: false,
      germany: false,
      france: false,
    };
  }

  render() {
    return (
      <div className="not-a-broker-register">
        <div className="t">Register for broker</div>
        <div className="input-wrapper">
          <label>Account</label>
          <Input placeholder="Account" />
          <div className="desc">
            <span>Letters and numbers and "_" are accepted.</span>
            <span className="note">
              This is your broker code which you should share to your trader.
            </span>
          </div>
        </div>
        <div className="input-wrapper">
          <label>Name</label>
          <Input placeholder="Name" />
          <div className="desc">
            <span>Letters and numbers and "_" are accepted.</span>
          </div>
        </div>

        <div className="input-wrapper input-wrapper-upload">
          <label>Address</label>
          <div className="upload"></div>
        </div>

        <div className="input-wrapper">
          <label>Address</label>
          <Input placeholder="Address" />
        </div>

        <div className="input-wrapper input-wrapper-langs">
          <label>Language</label>
          <div className="langs">
            <div className="line line1">
              <CheckBox
                title="English"
                checked={this.state.en}
                onChange={(v: boolean) => {
                  this.setState({
                    en: v,
                  });
                }}
              />
              <CheckBox
                title="中文简体"
                checked={this.state.cn}
                onChange={(v: boolean) => {
                  this.setState({
                    cn: v,
                  });
                }}
              />
              <CheckBox
                title="繁體中文"
                checked={this.state.tw}
                onChange={(v: boolean) => {
                  this.setState({
                    tw: v,
                  });
                }}
              />
            </div>
            <div className="line">
              <CheckBox
                title="Ру́сский"
                checked={this.state.russia}
                onChange={(v: boolean) => {
                  this.setState({
                    russia: v,
                  });
                }}
              />
              <CheckBox
                title="Tiếng Việt"
                checked={this.state.germany}
                onChange={(v: boolean) => {
                  this.setState({
                    germany: v,
                  });
                }}
              />
              <CheckBox
                title="Français"
                checked={this.state.france}
                onChange={(v: boolean) => {
                  this.setState({
                    france: v,
                  });
                }}
              />
            </div>
          </div>
        </div>

        <div className="input-wrapper input-wrapper-c">
          <label>Community</label>
          <div className="icon">
            <img src={tg} alt="" />
          </div>
          <div className="name">Telegram</div>
          <Input placeholder="Telegram" />
        </div>
        <div className="input-wrapper input-wrapper-c">
          <label></label>
          <div className="icon">
            <img src={discord} alt="" />
          </div>
          <div className="name">Discord</div>
          <Input placeholder="Telegram" />
        </div>
        <div className="input-wrapper input-wrapper-c">
          <label></label>
          <div className="icon">
            <img src={twitter} alt="" />
          </div>
          <div className="name">Twitter</div>
          <Input placeholder="Twitter" />
        </div>
        <div className="input-wrapper input-wrapper-c">
          <label></label>
          <div className="icon">
            <img src={reddit} alt="" />
          </div>
          <div className="name">Reddit</div>
          <Input placeholder="Reddit" />
        </div>
        <div className="input-wrapper input-wrapper-c">
          <label></label>
          <div className="icon">
            <img src={wechat} alt="" />
          </div>
          <div className="name">WeChat</div>
          <Input placeholder="WeChat" />
        </div>

        <div className="input-wrapper input-wrapper-a">
          <label>Introduction</label>
          <TextArea rows={4} />
          <div className="desc">
            <span>Less than 500 characters.</span>
          </div>
        </div>

        <div className="btns">
          <Button
            text="Confirm"
            fill={true}
            className="btn1"
            click={this.props.confirm}
          />
          <Button text="Cancel" className="btn2" click={this.props.cancel} />
        </div>
      </div>
    );
  }
}

export default Step3;