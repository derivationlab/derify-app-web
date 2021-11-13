import React from "react";

export enum ShowPosEnum{
  left='left',
  mid='mid',
  right='right'
}

interface TextOverflowViewProps {
  text: string;
  len: number;
  showPos: ShowPosEnum
}

const TextOverflowView: React.FC<TextOverflowViewProps> = ({ text, len,showPos}) => {
  text = text || "";
  let resultText = text;
  const showLen = len;
  const pos = showPos;

  if(showLen < text.length){
    if(pos === ShowPosEnum.right){
      resultText = text.substr(0, showLen) + "...";
    }else if(pos === ShowPosEnum.mid){
      resultText = text.substr(0, showLen/2) + "..." + text.substr(text.length - showLen/2, showLen/2);
    }else{
      resultText = "..." + text.substr(text.length - showLen, showLen);
    }
  }

  return <>{resultText}</>;
};

export default TextOverflowView;
