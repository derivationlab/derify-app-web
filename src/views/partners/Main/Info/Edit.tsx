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
import {countLength, cutLength} from "@/utils/utils";

interface EditProps extends ModalProps {
  onSubmitSunccess:(broker:BrokerInfo) =>void
}
const Edit: React.FC<EditProps> = props => {
  const [form] = Form.useForm();
  const history = useHistory();

  const walletInfo = useSelector<RootStore,UserState>(state => state.user);

  const defaultBroker = new BrokerInfo();

  const [broker, setBroker] = useState<BrokerInfo>(defaultBroker);
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

    form.setFieldsValue({broker: trader});
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
      form.setFieldsValue(brokerData);
      setSpining(false);
    }).finally(() => {
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

    if(!broker.introduction) {
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

    if(!/^[0-9a-zA-Z_@$]+$/.test(broker.id)){
      setErrorMsg($t('Broker.Broker.InfoEdit.FormatError'));
      return false;
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

    const param:any = {...broker};

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
            setBroker(allValues);
          }}
        >
          <ErrorMessage style={{margin: "10px 0"}} msg={errorMsg} visible={!!errorMsg} onCancel={() => setErrorMsg("")}/>
          <Form.Item hidden={true}
            label={$t("Broker.Broker.InfoEdit.WalletAddress")}
            name="broker"
          >
            <Input disabled value={broker.broker}/>
          </Form.Item>

          <Form.Item
            labelAlign={"left"}
            required={true}
            label={$t("Broker.Broker.InfoEdit.Name")}
            name="name"
          >
            <Input value={broker.name}/>
          </Form.Item>
          <Form.Item
            labelAlign={"left"}
            required={true}
            label={$t("Broker.Broker.InfoEdit.Avatar")}
            name="logo"
          >
            <Space size={24}>
              <Avatar shape="circle" size={80} src={avatarUrl}/>
              <Upload
                name="logoFile"
                listType="picture-card"
                className="avatar-uploader"
                accept="image/*"
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
            labelAlign={"left"}
            required={true}
            label={$t("Broker.Broker.InfoEdit.BrokerCode")}
            name="id"
          >
            <Input value={broker.id} onChange={({target:{value}}) =>{
              broker.id = value.toLowerCase();
              setBroker(broker);
            }}/>
          </Form.Item>
          <Form.Item label=" " colon={false} shouldUpdate>
            {() => {
              const brokerId = form.getFieldValue("id")

              return (<>
                <span>{`${webroot}/broker/`}</span><span className="main-white">{brokerId}</span>
              </>)
            }}

          </Form.Item>

          <Form.Item
            labelAlign={"left"}
            required={true}
            label={$t("Broker.Broker.InfoEdit.Introduction")}
            name="introduction"
          >
            <Input.TextArea showCount={{formatter:() => `${countLength(form.getFieldValue('introduction'))}/800`}}
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            onChange={({target:{value}}) => {
                              form.setFields([{name:'introduction', value: cutLength(value,800)}])
                            }}
                            value={broker.introduction}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>

  );
};

export default Edit;
