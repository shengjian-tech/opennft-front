import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Form,
  Space,
  Popconfirm,
  notification,
} from 'antd';
import {
  PageContent,
  batchDeleteConfirm,
  Pagination,
  QueryBar,
  Table,
  FormItem,

} from 'src/commons/ra-lib';
import config from 'src/commons/config-hoc';
import EditModal from './EditModal';
import Permission from 'src/components/permission';
import { preRouter } from 'src/commons/PRE_ROUTER';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;


export default config({
  path: '/dictionaries',
  ajax: true,
  connect: state => ({ layoutState: state.layout }),//获取当前选中

})((props) => {
  // 数据定义
  const [pageNo, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState(null);
  const [pids, setPids] = useState(null);
  const [typekeys, setTypeKeys] = useState(null);
  const [defaultState, setDefaultState] = useState(false);
  const [form] = Form.useForm();

  // 请求相关定义 只是定义，不会触发请求，调用相关函数，才会触发请求
  const [loading, fetchUsers] = props.ajax.usePost(`${props.layoutState.selectedMenu.pageUrl}`);
  const [deleting, deleteUsers] = props.ajax.usePost(`${CODEMAP.t_dictionaries_delete_more}`, { successTip: '删除成功！', errorTip: '删除失败！' });
  const [deletingOne, deleteUser] = useState(null)
  const [expert, expertUsers] = props.ajax.usePost(`${CODEMAP.t_dictionaries_export}`, { responseType: 'arraybuffer', successTip: '导出成功，请耐心等待下载！' });

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 240 },
    { title: '字典名称', dataIndex: 'name', width: 200 },
    { title: 'Val', dataIndex: 'val', width: 100 },
    { title: 'Code', dataIndex: 'code', width: 100 },
    { title: '编码', dataIndex: 'code', width: 100 },
    // { title: '父ID', dataIndex: 'pid', width: 100 },
    // {
    //   title: '字典类型', dataIndex: 'typekey', width: 100, render(value, record) {
    //     const { id } = record
    //     const { typekey } = record
    //     return <Link to={{ pathname: `${preRouter}/dictionaries/${id}`, state: { type: id } }}>{typekey}</Link>
    //   }
    // },
    { title: '字典类型', dataIndex: 'typekey', width: 100 },
    {
      title: '状态', dataIndex: 'active', width: 100, render(active) {
        return <span>{active == 1 ? '正常' : '停用'}</span>
      }
    },
    { title: '描述', dataIndex: 'remark', width: 150 },
    { title: '创建时间', dataIndex: 'createTime', width: 150 },
    {
      title: '操作', dataIndex: 'operator', width: 200,
      render: (value, record) => {
        const { id, pid, typekey } = record;
        return (
          <div>
            <Permission code={CODEMAP.t_dictionaries_save}>
              <Button type="link" onClick={() => setVisible(true) || setId(null) || setPids(id) || setTypeKeys(typekey) || setDefaultState(true)}>添加子项</Button>
            </Permission>
            <Permission code={CODEMAP.t_dictionaries_update}>
              <Button type="link" size="small" onClick={() => setVisible(true) || setId(id)}>编辑</Button>
            </Permission>
            <Permission code={CODEMAP.t_dictionaries_delete_one}>
              <Popconfirm placement="topLeft" title='确定删除吗？' onConfirm={() => handleDelete(id)} okText="确定" cancelText="取消">
                <Button type="text" size="small" danger >删除</Button>
              </Popconfirm>
            </Permission>
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
      .post(`${CODEMAP.t_dictionaries_delete_one}?id=${id}`)
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
    //     idList:selectedRowKeys
    // }
    await deleteUsers(selectedRowKeys);//多选id集合
    setSelectedRowKeys([]);
    await handleSearch();
  }
  async function handleBatchExport() {
    const values = form.getFieldsValue();
    const params = {
      data: {
        ...values,
      }
    }
    if (expert) return
    await expertUsers(params).then(res => {
      let blob = new Blob([res], { type: 'application/octet-stream' })
      let url = window.URL.createObjectURL(blob);
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
  // 组件初始化完成之后，进行一次查询  初始化搜索。
  useEffect(() => {
    (async () => {
      await handleSearch({ pageNo, pageSize });
    })();
  }, [pageNo, pageSize]);

  const formLayout = {
    style: { width: 200 },
  };

  const pageLoading = loading || deleting || deletingOne;
  const disabledDelete = !selectedRowKeys?.length || pageLoading;
  return (
    <PageContent loading={pageLoading}>
      <QueryBar>
        <Form
          layout="inline"
          form={form}
          onFinish={() => handleSearch({ pageNo: 1 })}
        >
          <FormItem
            {...formLayout}
            label="字典名称"
            name="name"
          />
          <FormItem
            {...formLayout}
            label="字典类型"
            name="typekey"
          />
          <FormItem
            {...formLayout}
            label="状态"
            name="active"
            allowClear
            options={[
              { value: 1, label: "正常" },
              { value: 0, label: "停用" },
            ]}
            onChange={() => handleSearch({ pageNo: 1 })}
          />
          <FormItem>
            <Space>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button onClick={() => { form.resetFields(); handleSearch() }}>重置</Button>
              <Permission code={CODEMAP.t_dictionaries_save}>
                <Button type="primary" onClick={() => setVisible(true) || setId(null) || setDefaultState(false)}>添加</Button>
              </Permission>
              <Permission code={CODEMAP.t_dictionaries_delete_more}>
                <Button type="primary" danger disabled={disabledDelete} onClick={handleBatchDelete}>删除</Button>
              </Permission>
              <Permission code={CODEMAP.t_dictionaries_export}>
                <Button type="primary" onClick={handleBatchExport}>导出</Button>
              </Permission>
            </Space>
          </FormItem>
        </Form>
      </QueryBar>

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
        pids={pids}
        defaultState={defaultState}
        typekeys={typekeys}
        isEdit={id !== null}
        onOk={async () => {
          setVisible(false);
          await handleSearch({ pageNo: 1 });
        }}
        onCancel={() => setVisible(false)}
      />
    </PageContent>
  );
});
