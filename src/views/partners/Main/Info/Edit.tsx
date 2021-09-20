import React, {useCallback, useEffect, useState} from "react";
import {Avatar, Button, Form, Image, Input, Modal, Space, Spin, Upload} from "antd";
import {ModalProps} from "antd/es/modal";
import {useSelector} from "react-redux";
import {RootStore} from "@/store";
import {BrokerInfo, getBrokerByBrokerId, getBrokerByTrader, updateBroker} from "@/api/broker";
import {useIntl} from "react-intl";
import {getWebroot} from "@/config";
import ErrorMessage from "@/components/ErrorMessage";
import {UploadChangeParam} from "antd/es/upload";
import {useHistory} from "react-router-dom";
import {UserState} from "@/store/modules/user";

interface EditProps extends ModalProps {
  onSubmitSunccess:(broker:BrokerInfo) =>void
}
const Edit: React.FC<EditProps> = props => {
  const [form] = Form.useForm();
  const history = useHistory();

  const walletInfo = useSelector<RootStore,UserState>(state => state.user);

  const [broker, setBroker] = useState<BrokerInfo>(new BrokerInfo());
  const [avatarUrl, setAvatarUrl] = useState<string|ArrayBuffer>(broker.logo);
  const [logoFile, setLogoFile] = useState<File>();
  const [errorMsg,setErrorMsg] = useState<any>("")
  const [spining,setSpining] = useState<boolean>(false)


  const webroot = getWebroot();

  const {formatMessage} = useIntl();

  function intl<T>(id:string,values:T[] = []) {

    const intlValues:{[key:number]:T} = {}

    values.forEach((item, index) => {
      intlValues[index] = item
    })


    return formatMessage({id}, intlValues)
  }

  const $t = intl;

  useEffect(() =>{
    const trader = walletInfo.selectedAddress;
    if(!trader || !props.visible){
      return
    }
    setSpining(true);
    getBrokerByTrader(trader).then((data) => {

      if(!data){
        setSpining(false);
        return
      }

      const brokerData = Object.assign(broker, data);
      brokerData.broker = trader;
      setAvatarUrl(brokerData.logo);
      setBroker(brokerData);
      form.resetFields();
      setSpining(false);
    });

  },[walletInfo, props]);

  const checkForm = useCallback(async (broker) => {
    if(!broker.broker) {
      setErrorMsg($t('Broker.Broker.InfoEdit.InfoRequired'))
      return false
    }

    if(!broker.name) {
      setErrorMsg($t('Broker.Broker.InfoEdit.InfoRequired'))
      return false
    }


    if(!logoFile && !broker.logo) {
      setErrorMsg($t('Broker.Broker.InfoEdit.InfoRequired'))
      return false
    }

    var file = logoFile;


    if(file && file.size > 2*1024*1024) {
      setErrorMsg($t('Broker.Broker.InfoEdit.PhotoSizeError'))
      return false
    }

    if(!broker.id) {
      setErrorMsg($t('Broker.Broker.InfoEdit.InfoRequired'))
      return false
    }

    const resBroker = await getBrokerByBrokerId(broker.id)
    if(resBroker && resBroker.id && resBroker.broker.toUpperCase() !== broker.broker.toUpperCase()) {
      setErrorMsg($t('Broker.Broker.InfoEdit.CodeOccuError'))
      return false
    }

    setErrorMsg("")

    return true
  }, [logoFile])


  const onFileChange = useCallback((param:UploadChangeParam) =>{

    if(!param.file || !param.file.size){
      return;
    }


    const {file,fileList} = param;


    const isLt2M = param.file.size / 1024 / 1024 < 2;
    if(!isLt2M){
      setErrorMsg($t("Broker.Broker.InfoEdit.PhotoSizeError"));
      return;
    }

    if (!fileList || !fileList[fileList.length - 1]) {
      return
    }

    const latestFile = fileList[fileList.length - 1];

    if(!latestFile.originFileObj){
      return;
    }

    setLogoFile(latestFile.originFileObj)

    const reader = new FileReader();

    reader.readAsDataURL(latestFile.originFileObj);
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        setAvatarUrl(e.target.result)
      }
    };


  }, [broker])

  const onFormSubmit = useCallback(async (broker) => {

    setSpining(true);
    const checkRet = await checkForm(broker)
    if(!checkRet) {
      setSpining(false);
      return
    }

    const param:any = {broker: broker.broker, id: broker.id, name: broker.name};

    if(logoFile){
      param.logo = logoFile
    }else{
      param.logo = broker.logo
    }

    updateBroker(param).then((res) => {
      if(res.success) {
        props.onSubmitSunccess(res.data);
      }else{
        setErrorMsg(res.msg);
      }

    }).catch(e => {
      setErrorMsg($t('global.TradeFailedMsg'))
    }).finally(() => {
      setSpining(false);
    });

  },[logoFile])

  return (

    <Modal {...props} title={$t("Broker.Broker.InfoEdit.Title")} width={1000} onOk={() => onFormSubmit(form.getFieldsValue())}>
      <Spin spinning={spining}>
        <Form
          form={form}
          name="broker"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={broker}
          autoComplete="off"
          onValuesChange={(changedValues, allValues) => {
            console.log(changedValues, allValues)
          }}
        >
          <ErrorMessage style={{margin: "10px 0"}} msg={errorMsg} visible={!!errorMsg} onCancel={() => setErrorMsg("")}/>
          <Form.Item

            label={$t("Broker.Broker.InfoEdit.WalletAddress")}
            name="broker"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input disabled value={broker.broker}/>
          </Form.Item>

          <Form.Item
            label={$t("Broker.Broker.InfoEdit.Name")}
            name="name"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input value={broker.name}/>
          </Form.Item>
          <Form.Item
            label={$t("Broker.Broker.InfoEdit.Avatar")}
            name="logo"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Space size={24}>
              <Avatar shape="circle" size={80} src={avatarUrl}/>
              <Upload
                name="logoFile"
                listType="picture-card"
                className="avatar-uploader"
                accept="image/gif,image/jpeg,image/jpg,image/png"
                maxCount={0}
                multiple={false}
                showUploadList={false}
                beforeUpload={(file) => false}
                onChange={onFileChange}
              >
                <Button type="primary">{$t("Broker.Broker.InfoEdit.Upload")}</Button>
              </Upload>
            </Space>
          </Form.Item>
          <Form.Item
            label={$t("Broker.Broker.InfoEdit.BrokerCode")}
            name="id"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input value={broker.id} />
          </Form.Item>
          <Form.Item label=" " colon={false}>
            <span>{`${webroot}/${broker.id}`}</span>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>

  );
};

export default Edit;
