import React, { useState, useEffect } from 'react';
import { Form, message,Modal,Button } from 'antd';
import config from 'src/commons/config-hoc';
import { ModalContent, FormItem } from 'src/commons/ra-lib';
import moment from 'moment';
import QRCode  from 'qrcode.react';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

let aaa = ''

const formLayout = {
  labelCol: {
    flex: '100px',
  },
};

export default config({
  modal: {
    title: '上架（注意需要支付Gas）',
  },
})(props => {
  const { onOk } = props;
  const [form] = Form.useForm();
  const [payState,setPayState] = useState(false)
  const [visiblePay,setVisiblePay] = useState(false)
  const [payData,setPayData] =useState(0)

  async function handleSubmit(values) {
    values.id = localStorage.getItem('worksId')
    values.waitingTime = moment(values.waitingTime).format('YYYY-MM-DD')
    values.outTime = moment(values.outTime).format('YYYY-MM-DD')
    props.ajax.post(`${CODEMAP.nft_order_generateOrderWorksIn}`, values).then(res => {
      if (res.statusCode == 200) {
        setPayData(res.result)
        message.success(res.message)
        setVisiblePay(true)
        aaa = setInterval(() => {
          getResult(res.result.id)
        }, 1000);
      } else {
        message.error('上架失败')
      }
    })
  }
  function getResult(id){
    props.ajax.post(`${CODEMAP.nft_mobile_order_checkOrderState}?orderId=${id}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        setPayState(res.result)
        if(res.result){
          clearInterval(aaa)
          message.success('作品成功支付并已上架！')
          setVisiblePay(false)
          onOk && onOk()
        }
      }else{
        message.error(res.message ? res.message : '失败')
      }
    })
  }
  useEffect(() => {
    (async () => {
      
    })();
  }, []);
  return (
    <ModalContent
      okText="上架"
      cancelText="重置"
      onOk={() => form.submit()}
      onCancel={() => form.resetFields()}
    >
      <Form
        form={form}
        onFinish={(values) => handleSubmit(values)}
      >
        <FormItem
          {...formLayout}
          label="价格"
          name="price"
          required
        />
        <FormItem
          {...formLayout}
          label="上架时间"
          name="waitingTime"
          type='date'
          required
        />
        <FormItem
          {...formLayout}
          label="下架时间"
          name="outTime"
          type='date'
          required
        />
      </Form>
      <Modal title="微信扫码支付gas费用" visible={visiblePay} onCancel={() => { setVisiblePay(false);clearInterval(aaa) }} 
      footer={
          [
            <Button type='primary' key="back" onClick={() =>{setVisiblePay(false);clearInterval(aaa)}}>
              取消上架
            </Button>,
          ]
        }>
          <h3>当前订单信息(单位：元)</h3>
          <p style={{fontWeight:600}}>当前订单需消耗gas金额：￥{payData?.gas}</p>
          <p style={{fontWeight:600}}>当前上架作品数量为：{payData?.num}</p>
          <p style={{fontWeight:600}}>当前订单需支付金额：￥{payData?.tradeTotal}</p>
          <div style={{margin:'0 auto',textAlign:'center'}}>
            <QRCode
              value={payData?.codeUrl} //value参数为生成二维码的链接
            />
          </div>
      </Modal>
    </ModalContent>
  );
});