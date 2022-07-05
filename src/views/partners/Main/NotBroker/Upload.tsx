import { Upload } from "antd";
import React, { FC, useState } from "react";
import type { RcFile } from "antd/es/upload/interface";

interface Props {
  onError: (err: string) => void
  onRight: (f: RcFile) => void
}

const fileType = ["image/jpeg", "image/png"];

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const CUpload: FC<Props> = ({ onError, onRight }) => {
  const [imageUrl, setImageUrl] = useState<string>("");

  const beforeUpload = (file: RcFile) => {
    const limit = file.size / Math.pow(1024, 2) < 2;
    const support = fileType.includes(file.type.toLowerCase());
    if (!support) {
      onError("You can only upload JPG/PNG file.");
      return;
    }
    if (!limit) {
      onError("the file size can not bigger than 2 M");
      return;
    }
    getBase64(file, url => {
      onRight(file);
      setImageUrl(url);
    });
  };

  return (
    <Upload
      accept="image/*"
      listType="picture-card"
      className="web-c-upload"
      showUploadList={false}
      beforeUpload={beforeUpload}
    >
      {imageUrl ? <img src={imageUrl} alt="" /> : (<i>click to upload image</i>)}
    </Upload>
  );
};

export default CUpload;
