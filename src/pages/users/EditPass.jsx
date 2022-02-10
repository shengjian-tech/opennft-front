import React, { useState, useEffect } from 'react';
import { Form, notification } from 'antd';
import config from 'src/commons/config-hoc';
import { ModalContent, FormItem } from 'src/commons/ra-lib';
import { usePost } from 'src/commons/ajax';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

const formLayout = {
  labelCol: {
    flex: '100px',
  },
};

export default config({
  modal: {
    title: '重置密码',
    width: 600,
  },
})(props => {
  const { id, onOk } = props;
  const [form] = Form.useForm();
  const [updating, updateUser] = props.ajax.usePost(`${CODEMAP.t_user_reset_pass}`);
  console.log(id)
  async function handleSubmit(values) {
    if (updating) return;
    await updateUser(values).then(res => {
      if (res.statusCode != 200) {
        notification.error({
          message: res.message,
          duration: 2,
        });
      } else {
        notification.success({
          message: res.message,
          duration: 2,
        });
      }
    });
    onOk && onOk();
  }
  return (
    <ModalContent
      loading={updating}
      okText="保存"
      cancelText="重置"
      onOk={() => form.submit()}
      onCancel={() => form.resetFields()}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
      >
        <FormItem
          {...formLayout}
          label="登录账号"
          name="account"
          initialValue={id}
          disabled
        />
        {/* <FormItem
          {...formLayout}
          label="旧密码"
          name="oldPwd"
          required
        /> */}
        <FormItem
          {...formLayout}
          label="新密码"
          name="newPwd"
          required
        />
      </Form>
    </ModalContent>
  );
});


