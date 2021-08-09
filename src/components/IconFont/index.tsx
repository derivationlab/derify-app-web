import React, { FC, CSSProperties } from "react";
import classNames from "classnames";

import "./index.less";

export interface IconFontProps extends React.HTMLAttributes<HTMLDivElement> {
  type: string;
  size?: number | string;
  color?: string;
  theme?: string;
  style?: CSSProperties;
}
const IconFont: FC<IconFontProps> = props => {
  const { type, size = 12, color, theme, style, ...others } = props;
  const inileStyle = { ...style, fontSize: size };

  // @ts-ignore
  return (
    <div
      {...others}
      style={inileStyle}
      className={classNames("derify-iconfont", `${type} `)}
    ></div>
  );
};
export default IconFont;
