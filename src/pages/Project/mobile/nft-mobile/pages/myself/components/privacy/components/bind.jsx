import React, { useState, useEffect } from 'react';
import { Form, message,Row,Col,Button,Input } from 'antd';
import config from 'src/commons/config-hoc';
import { Modal } from 'antd-mobile'
import { ModalContent, FormItem } from 'src/commons/ra-lib';
import moment from 'moment';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

function geturl(name) {
  var reg = new RegExp('[^\?&]?' + encodeURI(name) + '=[^&]+')
  var arr = window.location.search.match(reg)
  if (arr != null) {
    return decodeURI(arr[0].substring(arr[0].search('=') + 1))
  }
  return ''
}

const formLayout = {
  labelCol: {
    flex: '100px',
  },
};

export default config({
  modal: {
    title: '绑定百度超级链开放网络',
  },
})(props => {
  const { onOk } = props;
  const [form] = Form.useForm();
  const [codeState,setCodeState] = useState(false)
  const [captchaData,setCaptchaData] = useState(null)
  const [visible,setVisible] = useState(false)
  const [codeValue,setCodeValue] = useState(null)
  const [phone,setPhone] = useState(null)
  const [num,setNum] = useState(60)

  async function handleSubmit (values){
    props.ajax.post(`${CODEMAP.nft_mobile_userchainplat_bindPrivateAndPasswd}`,values).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        message.success(res.message)
        onOk()
      } else {
        message.error(res.message);
      }
    })
  }
  useEffect(() => {
    (async () => {
      getPhone()
    })();
  }, []);
  //获取手机号
  function getPhone(){
    props.ajax.post(`/api/nft/login/getUserPhone`,).then(res => {
      if(res.status == 'success' && res.statusCode == 200){
        setPhone(res.result)
      }else{
        message.error(res.message)
      }
    })
  }
  //获取图片验证码
  function getCaptcha(){
    if(phone){
      setVisible(true)
      props.ajax.post(`api/getCaptcha`, null, { errorTip: true, noEmpty: true }).then(res => {
        if(res.status == 'success' && res.statusCode == 200){
          setCaptchaData(res.result)
        }else{
          message.error(res.message)
        }
      })
    }else{
      message.warning('手机号不存在，请查看个人信息或联系管理员')
    }
  }
  //60s倒计时
  function handleCountDown(seconds=60){
    // let second = 60;
    let second = seconds;
    const countDown = ()=> {
        // timer && clearTimeout(timer); //清除计时器
        if( second > 0){
            // let second =
            // countDownSecond--;
            // let a  = countDownSecond - 1;
            second--;
            setNum(second)
        }
        if( second === 0 ){
            /*
                _this.countDown = 60;//恢复60s设定
                _this.isVerify = false;//不显示60s计时器
                clearTimeout(count60Timeout)//清除计时器
                return //结束方法的调用
            */
            second = 60;
            setNum(second)
            setCodeState(false)
            // clearTimeout( timer ); //清除计时器
            return;
        }
        // let timer = setTimeout( countDown,1000 );
        setTimeout( countDown,1000 );
    };
    setTimeout( countDown,1000 );
};
  //获取手机验证码
  function getCode(){
    const params = {
      phone:phone,
      captchaKey:captchaData.captchaKey,
      code:codeValue
    }
    props.ajax.post(`/api/sendCode`, params, { errorTip: true, noEmpty: true }).then(res => {
      if(res.status=='success' && res.statusCode == 200){
        message.success(res.message)
        handleCountDown(60)
        setCodeState(true)
        setVisible(false)
      }else{
        message.error(res.message)
        getCaptcha()
      }
    })
  }
  function getCodeValue(e){
    setCodeValue(e.target.value)
  }
  return (
    <ModalContent
      okText="保存"
      cancelText="重置"
      onOk={() => form.submit()}
      onCancel={() => form.resetFields()}
    >
      <h3>当前用户手机号：{phone}</h3>
      <h4 style={{color:'red'}}>（注：仅可绑定一次，绑定后不可修改）</h4>
      <Form
        form={form}
        onFinish={(values) => handleSubmit(values)}
      >
        <FormItem
          label="私钥"
          name="privateKey"
          size='large'
          required
        />
        <FormItem
          label="安全码"
          name="passwd"
          size='large'
          rules={[{ required: true, message: '请输入安全码' }, { min: 6, message: '请输入六位数安全码' },{ max: 6, message: '请输入六位数安全码' }]}
          required
        />
        <Row gutter={30}>
          <Col span={14}>
            <FormItem
              label="验证码"
              name="verificationCode"
              size='large'
              required
            />
          </Col>
          <Col span={10}>
            {codeState == true ? <Button type='primary' size='large' style={{marginTop:'36px'}} disabled>短信已发送({num})</Button>
            : <Button onClick={getCaptcha} style={{marginTop:'36px'}} type='primary' size='large'>获取短信验证码</Button>}
          </Col>
        </Row>
      </Form>
      <Modal
        visible={visible}
        showCloseButton
        content={
          <div style={{textAlign:'center'}}>
            <img style={{margin:'10px 0 10px 0'}} onClick={getCaptcha} src={captchaData?.imageBase64} alt="" />
            <Input onChange={getCodeValue} size='large' placeholder='请输入图片验证码'></Input>
          </div>
        }
        closeOnAction
        onAction={getCode}
        onClose={() =>setVisible(false)}
        actions={[
          {
            key: 'confirm',
            text: '确认',
          },
        ]}
      />
    </ModalContent>
  );
});