import React, { useState, useEffect } from 'react';
import { Form, Row, Col, notification, TreeSelect, Table, Select, Button } from 'antd';
import config from 'src/commons/config-hoc';
import { ModalContent, FormItem } from 'src/commons/ra-lib';
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
    title: props => props.isEdit ? '修改用户' : '添加用户',
    width: 600,
  },
})(props => {
  const { isEdit, id, onOk } = props;
  const [form] = Form.useForm();
  const [data, setData] = useState({});
  const [treeData, setTreeData] = useState([])
  const [dataSource, setDataSource] = useState([{ id: '', managerType: "", index: '0', key: Math.random(100) }])
  const [roleData, setRoleData] = useState([])
  const [userTypeList, setUserTypeList] = useState([])
  const [loading, fetchUser] = usePost(`${CODEMAP.t_user_look}?id=${id}`);
  const [loadings, getTreeInfo] = usePost(`${CODEMAP.t_find_user_org_tree}`);
  const [loadingRole, getRoleInfo] = usePost(`${CODEMAP.t_user_role_list}`);
  const [saving, saveUser] = props.ajax.usePost(`${CODEMAP.t_user_save}`);
  const [updating, updateUser] = props.ajax.usePost(`${CODEMAP.t_user_update}`);
  const [getLoading, getUserTypePost] = props.ajax.usePost(`${CODEMAP.t_user_userTypeList}`);

  async function fetchData() {
    if (loading) return;

    const res = await fetchUser(id);
    setData(res?.result || {});
    res.result.orgList.forEach((item, index) => {
      dataSource.push({ id: item.id, managerType: item.managerType, key: Math.random(200), index: index })
    });
    dataSource.shift()

    const arr2 = []
    res.result.roles.forEach(item => {
      arr2.push(item.id)
    });
    res.result.roles = arr2
    form.resetFields()
  }

  async function getTreeData() {
    if (loadings) return;
    const res = await getTreeInfo();
    setTreeData(res?.result || {});
  }
  const newData = dataSource
  async function addOrgList() {
    var number = 0
    for (let index = 0; index < dataSource.length; index++) {
      number += 1
    }
    newData.push({ id: '', managerType: "", index: number, key: Math.random(100) })
    setDataSource(newData.slice())
  }

  async function getRoleData() {
    if (loadingRole) return;
    const params = {
      data: {
        active: 1
      }
    };
    const res = await getRoleInfo(params);
    const roleArr = []
    res.result.forEach(item => {
      roleArr.push({ key: item.id, title: item.name })
    });
    setRoleData(roleArr);
  }
  //用户类型
  async function getUserTypeData() {
    if (getLoading) return;
    const params = {};
    const res = await getUserTypePost(params);
    console.log(res);
    setUserTypeList(res.result);
  }



  function deleteOrgList(key) {
    setDataSource(dataSource.filter(item => item.key !== key))
  }
  function getManagerType(value, index) {
    dataSource[index].managerType = value
  }
  function getId(value, index) {
    dataSource[index].id = value
  }
  async function handleSubmit(values) {
    // values.roles = values.roles[{}]
    const roleArr1 = values.roles
    const newRoleArr = []
    roleArr1.forEach((row) => {
      newRoleArr.push({ id: row })
    })
    values.roles = newRoleArr
    values.orgList = dataSource
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
      await getTreeData()
      await getRoleData()
      await getUserTypeData()
    })();
  }, []);
  const modalLoading = loading || saving || updating;
  const columns = [
    {
      title: '部门', dataIndex: 'id', render: (value, record) => {
        const { index } = record
        return <TreeSelect
          placeholder={"请选择部门"}
          treeData={treeData}
          treeDefaultExpandAll
          defaultValue={isEdit ? record.id : null}
          onChange={(val) => { getId(val, index) }}
        ></TreeSelect>
      }
    },
    {
      title: '职位', dataIndex: 'managerType', width: 150, render: (value, record) => {
        const { Option } = Select;
        const { index } = record
        return <Select placeholder="请选择职位" defaultValue={isEdit ? record.managerType : null} onChange={(val) => { getManagerType(val, index) }}>
          <Option label="会员" value={0}>会员</Option>
          <Option label="员工" value={1}>员工</Option>
          <Option label="主管" value={2}>主管</Option>
        </Select>
      }
    },
    {
      title: '操作', dataIndex: 'operator', width: 80,
      render: (value, record) => {
        const { key } = record;
        return (
          <div>
            <Button type="primary" size="small" danger onClick={() => { deleteOrgList(key) }}>删除</Button>
          </div >
        );
      },
    },
  ];
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
              label="用户名称"
              name="userName"
              required
              noSpace
            />
          </Col>
          <Col flex={1}>
            <FormItem
              {...formLayout}
              label="登录账号"
              name="account"
              required
            />
          </Col>
        </Row>
        {/* <FormItem
                    {...formLayout}
                    type="select-tree"
                    label="部门"
                    name="orgList"
                    treeNodeFilterProp="title"
                    placeholder="请选择归属部门"
                    showSearch
                    multiple
                    allowClear
                    treeDefaultExpandAll
                    required
                    options={treeData}
                /> */}
        <FormItem
          {...formLayout}
          label="部门"
          name="orgList">
          <Button type="primary" size="small" onClick={() => { addOrgList() }}>添加部门</Button>
          <Table
            dataSource={dataSource} columns={columns}
            pagination={false}
            showHeader={false}
            rowKey='key'
          />
        </FormItem>
        <FormItem
          {...formLayout}
          type="select-tree"
          label="角色"
          name="roles"
          allowClear
          treeNodeFilterProp="title"
          multiple
          treeDefaultExpandAll
          required
          options={roleData}
        />
        <FormItem
          {...formLayout}
          type="select"
          label="用户类型"
          name="userType"
          required
          options={userTypeList}
        />
        <FormItem
          {...formLayout}
          type="select"
          label="是否有效"
          name="active"
          options={[
            { value: 0, label: '否' },
            { value: 1, label: '是' },
          ]}
          required
        />
        {/* <FormItem
                    {...formLayout}
                    type="select"
                    label="用户身份"
                    name="userType"
                    options={[
                        { value: 0, label: '会员' },
                        { value: 1, label: '员工' },
                        { value: 2, label: '店长收银' },
                        { value: 9, label: '超级管理员' },
                    ]}
                /> */}
        <FormItem
          {...formLayout}
          type="mobile"
          label="手机"
          name="mobile"
        />
        <FormItem
          {...formLayout}
          type="email"
          label="邮箱"
          name="email"
        />
      </Form>
    </ModalContent>
  );
});


