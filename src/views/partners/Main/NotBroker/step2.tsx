import * as React from "react";
import Notice from "@/components/notice";
import Button from "@/components/buttons/borderButton";

interface Step2Props {
  confirm: any;
  cancel: any;
}

const Step2: React.FunctionComponent<Step2Props> = props => {
  return (
    <div className="not-a-broker-burn">
      <div className="t">
        Burn eDRF to get broker privilege
        <Notice title="Burn eDRF to get broker privilege" />
      </div>
      <div className="data">
        <div className="t1">Getting broker privilege will cost you</div>
        <div className="num">
          <span>600</span>
          <span className="unit">eDRF</span>
        </div>
        <div className="hr"></div>
        <div className="wallet">Wallet Balance : 45,644.23 eDRF</div>
        <div className="addr">0x40d276e6a7C80562BB1848e3ACB7B7629234C5a6</div>
      </div>
      <div className="btns">
        <Button
          text="Confirm"
          fill={true}
          className="btn1"
          click={props.confirm}
        />
        <Button text="Cancel" className="btn2" click={props.cancel} />
      </div>
    </div>
  );
};

export default Step2;
