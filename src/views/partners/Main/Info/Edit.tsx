import React from "react";
import { Modal, Form, Input, Avatar, Button, Space, Upload } from "antd";
import { ModalProps } from "antd/es/modal";

interface EditProps extends ModalProps {}
const Edit: React.FC<EditProps> = props => {
  return (
    <Modal {...props} title="编辑信息" width={1000}>
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
      >
        <Form.Item

          label="地址"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="姓名"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="头像"
          name="avatar"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Space size={24}>
            <Avatar size={80} />
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              multiple={false}
              showUploadList={false}
              beforeUpload={() => false}
            >
              <Button type="primary">上传头像</Button>
            </Upload>
          </Space>
        </Form.Item>
        <Form.Item
          label="账户"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <span>https://app.derify.finance/coinbaby</span>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Edit;
