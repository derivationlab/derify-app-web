import React, { useEffect, useState ,memo} from "react";
import classNames from "classnames";
import "./index.less";
import {SideEnum} from "@/utils/contractUtil";
import {useIntl} from "react-intl";

interface LongOrShortProps {
  power: number;
  value: SideEnum;
}

const LongOrShort: React.FC<LongOrShortProps> = ({ value, power }) => {
  const [val, setValue] = useState(value);

  const { formatMessage } = useIntl();

  function intl(id:string) {
    return formatMessage({id})
  }

  const $t = intl

  useEffect(() => {
    setValue(value);
  }, [value]);

  return (
    <div className={classNames(["long-or-short", val])}>
      <span>{(val === SideEnum.LONG) ? $t("Trade.MyPosition.List.Long") : $t("Trade.MyPosition.List.Short")}</span>
      <span>{power + "x"}</span>
    </div>
  );
};

export default memo(LongOrShort);
