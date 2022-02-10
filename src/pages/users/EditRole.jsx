import React, { useState, useEffect } from 'react';
import { notification, Table } from 'antd';
import config from 'src/commons/config-hoc';
import { ModalContent } from 'src/commons/ra-lib';
import { usePost } from 'src/commons/ajax';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

export default config({
  modal: {
    title: '角色分配',
    width: 600,
  },
})(props => {
  const { id, onOk } = props;
  const { onCancel } = props;
  const [loading, fetchUsers] = props.ajax.usePost(`${CODEMAP.t_user_get_role}`);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [updating, updateUser] = props.ajax.usePost(`${CODEMAP.t_user_distribution_role}`);

  const columns = [
    // { title: '用户ID', dataIndex: 'id', width: 200 },
    { title: '角色编号', dataIndex: 'id', width: 100 },
    { title: '角色名称', dataIndex: 'name', width: 100 },
    { title: '权限字符', dataIndex: 'mobile', width: 150 },
    { title: '创建时间', dataIndex: 'createTime', width: 150 },
  ];

  async function handleSearch(options = {}) {
    if (loading) return
    const res = await fetchUsers();
    setDataSource(res?.result || []);
  }
  async function handleSubmit() {
    if (updating) return;
    const params = {
      userId: id,
      roleIds: selectedRowKeys
    }
    await updateUser(params).then(res => {
      if (res.statusCode != 200) {
        notification.error({
          message: res.message,
          duration: 2,
        });
      }
    });
    onOk && onOk();
  }

  async function handleCancel() {
    onCancel && onCancel();
  }
  // 组件初始化完成之后，请求表格信息
  useEffect(() => {
    (async () => {
      await handleSearch();
    })();
  }, []);
  return (
    <ModalContent
      loading={updating}
      onOk={() => handleSubmit()}
      onCancel={() => handleCancel()}
    >
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowKey="id"
      />
    </ModalContent>
  );
});