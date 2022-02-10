import React, { useState, useEffect } from 'react';
import { Form, Row, Col, notification } from 'antd';
import config from 'src/commons/config-hoc';
import { ModalContent, FormItem, IconPicker } from 'src/commons/ra-lib';
import { useGet, usePost, usePut } from 'src/commons/ajax';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

const formLayout = {
  labelCol: {
    flex: '100px',
  },
};

export default config({
  modal: {
    title: props => props.isEdit ? '修改字典' : '添加字典',
    width: 600,
  },
})(props => {
  const { isEdit, id, onOk, pids, typekeys, defaultState } = props;
  const [form] = Form.useForm();
  const [data, setData] = useState({});
  const [loading, fetchUser] = usePost(`${CODEMAP.t_dictionaries_look}?dicId=${id}`);
  const [saving, saveUser] = props.ajax.usePost(`${CODEMAP.t_dictionaries_save}`);
  const [updating, updateUser] = props.ajax.usePost(`${CODEMAP.t_dictionaries_update}`);

  async function fetchData() {
    if (loading) return;

    const res = await fetchUser(id);
    setData(res?.result || {});
    form.resetFields()
  }
  async function handleSubmit(values) {
    if (saving || updating) return;
    const ajaxMethod = isEdit ? updateUser : saveUser;
    await ajaxMethod(values).then(res => {
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
    });;

    onOk && onOk()
  }
  useEffect(() => {
    (async () => {
      if (isEdit) await fetchData();
    })();
  }, []);
  const modalLoading = loading || saving || updating;
  return (
    <ModalContent
      loading={modalLoading}
      okText="保存"
      cancelText="重置"
      onOk={() => form.submit()}
      onCancel={() => form.resetFields()}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={data}
      >
        {isEdit ? <FormItem {...formLayout} hidden name="id" /> : null}

        <Row>
          <Col flex={1}>
            <FormItem
              {...formLayout}
              label="字典名称"
              name="name"
              required
              noSpace
            />
          </Col>
          <Col flex={1}>
            {defaultState == true ? <FormItem
              {...formLayout}
              label="字典类型"
              name="typekey"
              initialValue={typekeys}
              required
            /> : <FormItem
              {...formLayout}
              label="字典类型"
              name="typekey"
              required
            />}
          </Col>
        </Row>
        <FormItem
          {...formLayout}
          type="select"
          label="状态"
          name="active"
          options={[
            { value: 1, label: '正常' },
            { value: 0, label: '停用' },
          ]}
          required
        />
        {defaultState == true ? <FormItem
          {...formLayout}
          label="父ID"
          name="pid"
          initialValue={pids}
          required
        /> : <FormItem
          {...formLayout}
          label="父ID"
          name="pid"
          initialValue='root'
          required
        />}
        <FormItem
          {...formLayout}
          label="图标"
          name="bak1"
          required
        >
          <IconPicker />
        </FormItem>
        <FormItem
          {...formLayout}
          label="Code"
          name="code"
        />
        <FormItem
          {...formLayout}
          label="Val"
          name="val"
        />
        <FormItem
          {...formLayout}
          type="textarea"
          label="描述"
          name="remark"
        />
      </Form>
    </ModalContent>
  );
});


