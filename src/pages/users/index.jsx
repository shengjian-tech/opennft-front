import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Space,
  Popconfirm,
  Row,
  Col,
  notification,
  Upload,
  message
} from 'antd';
import {
  PageContent,
  batchDeleteConfirm,
  Operator,
  Pagination,
  QueryBar,
  Table,
  FormItem,
  ToolBar

} from 'src/commons/ra-lib';
import config from 'src/commons/config-hoc';
import EditModal from './EditModal';
import EditPass from './EditPass';
import EditRole from './EditRole';
import TreeDepartment from '../../components/tree-department/tree-department'
import Permission from 'src/components/permission';
import { ConsoleSqlOutlined } from '@ant-design/icons/es/icons';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;


export default config({
  path: '/users',
  ajax: true,
  connect: state => ({ layoutState: state.layout }),//获取当前选中

})((props) => {
  // 数据定义
  const [pageNo, setPageNum] = useState(1);
  const [treeId, setTreeId] = useState('')
  const [pageSize, setPageSize] = useState(20);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const [visiblePass, setPassVisible] = useState(false);
  const [visibleRole, setRoleVisible] = useState(false);
  const [id, setId] = useState(null);
  const [userName, setAccount] = useState(null);
  const [form] = Form.useForm();

  // 请求相关定义 只是定义，不会触发请求，调用相关函数，才会触发请求
  const [loading, fetchUsers] = props.ajax.usePost(`${props.layoutState.selectedMenu.pageUrl}`);
  const [deleting, deleteUsers] = props.ajax.usePost(`${CODEMAP.t_user_delete_more}`, { successTip: '删除成功！', errorTip: '删除失败！' });
  const [deletingOne, deleteUser] = useState(null)
  const [expert, expertUsers] = props.ajax.usePost(`${CODEMAP.t_user_export}`, { responseType: 'arraybuffer', successTip: '导出成功，请耐心等待下载！' });
  const [template, templateUsers] = props.ajax.usePost(`${CODEMAP.t_user_import_template}`, { responseType: 'arraybuffer',successTip: '下载成功，请耐心等待下载！' });

  const columns = [
    // { title: '用户ID', dataIndex: 'id', width: 200 },
    { title: '用户名称', dataIndex: 'userName', width: 100 },
    {
      title: '用户角色', dataIndex: 'roles', width: 100, render(roles) {
        return roles.map((item) => (
          <p style={{ margin: 0 }}>{item.name}</p>
        ))
      }
    },
    {
      title: '所属部门', dataIndex: 'orgList', width: 100, render(orgList) {
        return orgList.map((item) => (
          <p style={{ margin: 0 }}>{item.name}</p>
        ))
      }
    },
    { title: '登录账号', dataIndex: 'account', width: 100 },

    { title: '手机', dataIndex: 'mobile', width: 150 },
    { title: '邮箱', dataIndex: 'email', width: 150 },
    {
      title: '是否有效', dataIndex: 'active', width: 100, render(active) {
        return active == 1 ? '是' : '否'   //1是是，0是否
      }
    },
    { title: '创建时间', dataIndex: 'createTime', width: 150 },
    {
      title: '操作', dataIndex: 'operator', width: 200,
      render: (value, record) => {
        const { id, userName, account } = record;
        return (
          <div>
            <Permission code={CODEMAP.t_user_update}>
              <Button type="link" size="small" onClick={() => setVisible(true) || setId(id)}>编辑</Button>
            </Permission>
            <Permission code={CODEMAP.t_user_delete_one}>
              <Popconfirm placement="topLeft" title='确定删除吗？' onConfirm={() => handleDelete(id)} okText="确定" cancelText="取消">
                <Button type="text" size="small" danger >删除</Button>
              </Popconfirm>
            </Permission>
            <Permission code={CODEMAP.t_user_reset_pass}>
              <Button type="link" size="small" onClick={() => setPassVisible(true) || setAccount(account)}>重置密码</Button>
            </Permission>
            {/* <Permission code={CODEMAP.t_user_distribution_role}>
                            <Button type="link" size="small" onClick={() => setRoleVisible(true) || setId(id)}>分配角色</Button>
                        </Permission> */}
          </div >
        );
      },
    },
  ];

  // 函数定义
  async function handleSearch(options = {}) {
    if (loading) return;

    // 获取表单数据
    const values = form.getFieldsValue();
    const params = {
      data: {
        ...values,
        deptId: treeId
      }
    };

    // 翻页信息优先从参数中获取
    params.pageNo = options.pageNo || pageNo;
    params.pageSize = options.pageSize || pageSize;

    const res = await fetchUsers(params);

    setDataSource(res?.result || []);
    setTotal(res?.page.totalCount || 0);
  }

  function handleDelete(id) {
    props.ajax
      .post(`${CODEMAP.t_user_delete_one}?id=${id}`)
      .then(res => {
        if (res.statusCode == 200) {
          notification.success({
            message: res.message,
            duration: 2,
          })
        } else {
          notification.error({
            message: res.message,
            duration: 2,
          })
        }
        handleSearch();
      })
  }

  async function handleBatchDelete() {
    if (deleting) return;

    await batchDeleteConfirm(selectedRowKeys.length);
    // const params = {
    //     selectedRowKeys
    // }
    await deleteUsers(selectedRowKeys);//多选id集合
    setSelectedRowKeys([]);
    await handleSearch();
  }
  async function handleTemplate() {
    if (template) return
    await templateUsers().then(res => {
      let blob = new Blob([res], { type: 'application/octet-stream' })
      let url = window.URL.createObjectURL(blob)
      // let url = window.URL.createObjectURL(res); //表示一个指定的file对象或Blob对象
      let a = document.createElement("a");
      document.body.appendChild(a);
      // let fileName = res.headers["content-disposition"].split(";")[1].split("=")[1];  //filename名称从后端返回的headers截取
      // let fileName = params.objectName // 这里也可以这样获取到文件名
      a.href = url;
      a.download = '模板.xlsx'; //命名下载名称
      a.click(); //点击触发下载  
      window.URL.revokeObjectURL(url);
    })
  }
  async function handleBatchExport() {
    const values = form.getFieldsValue();
    const params = {
      data: {
        ...values,
        deptId:treeId
      }
    }
    if (expert) return
    await expertUsers(params).then(res => {
      let blob = new Blob([res], { type: 'application/octet-stream' })
      let url = window.URL.createObjectURL(blob)
      // let url = window.URL.createObjectURL(res); //表示一个指定的file对象或Blob对象
      let a = document.createElement("a");
      document.body.appendChild(a);
      // let fileName = res.headers["content-disposition"].split(";")[1].split("=")[1];  //filename名称从后端返回的headers截取
      // let fileName = params.objectName // 这里也可以这样获取到文件名
      a.href = url;
      a.download = '字典信息.xlsx'; //命名下载名称
      a.click(); //点击触发下载  
      window.URL.revokeObjectURL(url);
    })
  }
  function beforeUpload(file) {
    console.log(file.type)
    const isXls = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
    if (!isXls) {
      message.error('请确定您上传的文件格式!');
    }
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      message.error('文件大小不能超过20MB!');
    }
    return isXls && isLt2M;
  }
  function customRequest(options) {

    console.log(options);
    let params = new FormData();
    params.append("file", options.file);
    props.ajax.post(`${CODEMAP.t_user_import}`, params, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
      if (res.statusCode == 200) {
        message.success(res.message)
        handleSearch()
      } else {
        message.error(res.message)
      }
    })
  }
  const getTreeData = (e) => {
    setTreeId(e.treeId)
  }

  // 组件初始化完成之后，进行一次查询  初始化搜索。
  useEffect(() => {
    (async () => {
      await handleSearch({ pageNo, pageSize });
    })();
  }, [pageNo, pageSize, treeId]);

  const formLayout = {
    style: { width: 200 },
  };

  const pageLoading = loading || deleting || deletingOne;
  const disabledDelete = !selectedRowKeys?.length || pageLoading;
  return (
    <Row>
      <Col span={4} style={{ background: '#ffffff' }}>
        <TreeDepartment handleTreeInfo={getTreeData} />
      </Col>
      <Col span={20}>
        <PageContent loading={pageLoading}>
          <ToolBar>
            <Form
              layout="inline"
              form={form}
              onFinish={() => handleSearch({ pageNo: 1 })}
            >
              <FormItem
                {...formLayout}
                label="名称"
                name="userName"
              />
              <FormItem
                {...formLayout}
                label="手机号码"
                name="mobile"
              />
              <FormItem
                {...formLayout}
                label="是否有效"
                name="active"
                allowClear
                options={[
                  { value: 1, label: "是" },
                  { value: 0, label: "否" },
                ]}
                onChange={() => handleSearch({ pageNo: 1 })}
              />
              <FormItem>
                <Space>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button onClick={() => { form.resetFields(); handleSearch() }}>重置</Button>
                  <Permission code={CODEMAP.t_user_save}>
                    <Button type="primary" onClick={() => setVisible(true) || setId(null)}>添加</Button>
                  </Permission>
                  <Permission code={CODEMAP.t_user_delete_more}>
                    <Button type="primary" danger disabled={disabledDelete} onClick={handleBatchDelete}>删除</Button>
                  </Permission>
                  <Permission code={CODEMAP.t_user_import_template}>
                    <Button type="primary" onClick={handleTemplate}>下载模板</Button>
                  </Permission>
                  <Permission code={CODEMAP.t_user_import}>
                    <Upload
                      accept=".xls,.xlsx"
                      customRequest={customRequest}
                      beforeUpload={beforeUpload}
                      // fileList={fileList}
                      showUploadList={false}
                    >
                      <Button type="primary">导入</Button>
                    </Upload>
                  </Permission>
                  <Permission code={CODEMAP.t_user_export}>
                    <Button type="primary" onClick={handleBatchExport}>导出</Button>
                  </Permission>
                </Space>
              </FormItem>
            </Form>
          </ToolBar>

          <Table
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            columns={columns}
            dataSource={dataSource}
            rowKey="id"
            // serialNumber
            pageNum={pageNo}
            pageSize={pageSize}
          />
          <Pagination
            total={total}
            pageNum={pageNo}
            pageSize={pageSize}
            onPageNumChange={pageNo => setPageNum(pageNo)}
            onPageSizeChange={pageSize => {
              setPageNum(1);
              setPageSize(pageSize);
            }}
          />
          <EditModal
            visible={visible}
            id={id}
            isEdit={id !== null}
            onOk={async () => {
              setVisible(false);
              await handleSearch({ pageNo: 1 });
            }}
            onCancel={() => setVisible(false)}
          />
          <EditPass
            visible={visiblePass}
            id={userName}
            onOk={async () => {
              setPassVisible(false);
            }}
            onCancel={() => setPassVisible(false)}
          />
          <EditRole
            visible={visibleRole}
            id={id}
            onOk={async () => {
              setRoleVisible(false);
            }}
            onCancel={() => setRoleVisible(false)}
          />
        </PageContent>
      </Col>
    </Row>
  );
});
