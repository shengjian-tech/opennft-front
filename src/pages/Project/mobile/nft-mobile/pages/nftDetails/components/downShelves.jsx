import React, { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import config from 'src/commons/config-hoc';
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
    title: '下架',
  },
})(props => {
  const { onOk } = props;
  const [form] = Form.useForm();

  async function handleSubmit(values) {
    values.id = geturl('worksId')
    values.waitingTime = moment(values.waitingTime).format('YYYY-MM-DD')
    values.outTime = moment(values.outTime).format('YYYY-MM-DD')
    props.ajax.post(`${CODEMAP.nft_mobile_works_updateWorksIn}`, values).then(res => {
      if (res.statusCode == 200) {
        onOk && onOk()
        message.success(res.message)
      } else {
        message.error('保存失败')
      }
    })
  }
  useEffect(() => {
    (async () => {
      
    })();
  }, []);
  return (
    <ModalContent
      okText="保存"
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
    </ModalContent>
  );
});