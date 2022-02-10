import React, { Component } from 'react';
import { Form, message, Button, Table, TreeSelect, Select } from 'antd';
import { FormItem, ModalContent } from 'src/commons/ra-lib';
import config from 'src/commons/config-hoc';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
  ajax: true,
  modal: {
    title: props => props.isEdit ? '修改' : '添加',
  },
})


export default class EditModal extends Component {
  state = {
    loading: false,     // 页面加载loading
    data: {},       // 回显的角色数据
    dataSource: [{ orgId: '', isChildren: "", index: '0', key: Math.random(100) }],
    companyData: [],
    roleOrgTypeInfo: null,

    privateOrgOptions: [
      { value: 1, label: '是' },
      { value: 0, label: '否' },
    ],
    roleOrgTypeOptions: [
      { value: 0, label: '自己的数据' },
      { value: 1, label: '所在部门' },
      { value: 2, label: '所在部门及子部门数据' },
      { value: 3, label: '自定义部门数据' },
    ],
    shareRoleOptions: [
      { value: 1, label: '是' },
      { value: 0, label: '否' },
    ],
    activeOptions: [
      { value: 1, label: '是' },
      { value: 0, label: '否' },
    ]
  };

  componentDidMount() {
    const { isEdit } = this.props;
    this.fetchCompanyData()
    if (isEdit) {
      this.fetchData();
    }

  }
  addOrgList = () => {
    const { dataSource } = this.state
    const newData = dataSource
    var number = 0
    for (let index = 0; index < dataSource.length; index++) {
      number += 1
    }
    newData.push({ orgId: '', isChildren: "", index: number, key: Math.random(100) })
    this.setState({ dataSource: newData.slice() })
  }
  fetchData = () => {
    if (this.state.loading) return;

    const { id } = this.props;
    const params = { id: id }
    this.setState({ loading: true });
    this.props.ajax.post(`${CODEMAP.t_role_look}?id=${id}`, params)
      .then(res => {
        this.setState({ roleOrgTypeInfo: res.result.roleOrgType })
        console.log(res.result.roleOrgList)
        if (res.result.roleOrgList) {
          const Arr1 = []
          res.result.roleOrgList.map((item, index) => {
            Arr1.push({ orgId: item.orgId, isChildren: item.isChildren, key: Math.random(200), index: index })
          });
          this.state.dataSource.shift()
          this.setState({ dataSource: Arr1 })
        }
        this.setState({ data: res.result || {} });

        this.form.setFieldsValue(res.result)
      })
      .finally(() => this.setState({ loading: false }));
  };

  //部门数据
  fetchCompanyData = () => {
    this.setState({ loading: true });
    this.props.ajax.post(`${CODEMAP.t_roles_company}`)
      .then(res => {
        this.setState({ companyData: res.result || [] });
      })
      .finally(() => this.setState({ loading: false }));
  };
  deleteOrgList = (key) => {
    this.setState({ dataSource: this.state.dataSource.filter(item => item.key !== key) })
  }
  getManagerType = (value, index) => {
    this.state.dataSource[index].isChildren = value
  }
  getId = (value, index) => {
    this.state.dataSource[index].orgId = value
  }
  handleSubmit = (values) => {
    if (this.state.loading) return;
    values.roleOrgList = this.state.dataSource
    const { isEdit } = this.props;

    const ajaxUrl = isEdit ? `${CODEMAP.t_role_update}` : `${CODEMAP.t_role_save}`;

    this.setState({ loading: true });
    this.props.ajax.post(ajaxUrl, values)
      .then((res) => {
        if (res.statusCode == '200' && res.status == 'success') {
          message.success(res.message)
          const { onOk } = this.props;
          onOk && onOk();
        } else {
          message.error(res.message)
        }
      })
      .finally(() => this.setState({ loading: false }));
  };

  getCurrentInfo = (values) => {
    this.setState({ roleOrgTypeInfo: values })
  }
  render() {
    const { isEdit } = this.props;
    const { loading, data, activeOptions, roleOrgTypeOptions, shareRoleOptions,
      privateOrgOptions, companyData, roleOrgTypeInfo, dataSource } = this.state;
    const formProps = {
      labelCol: {
        flex: '100px',
      },

    };

    const columns = [
      {
        title: '部门', dataIndex: 'orgId', render: (value, record) => {
          const { index, orgId } = record
          return <TreeSelect
            placeholder={"请选择部门"}
            treeData={companyData}
            treeDefaultExpandAll
            defaultValue={isEdit ? orgId : null}
            onChange={(val) => { this.getId(val, index) }}
          ></TreeSelect>
        }
      },
      {
        title: '包含子部门', dataIndex: 'isChildren', width: 150, render: (value, record) => {
          const { Option } = Select;
          const { index, isChildren } = record
          return <Select placeholder="是否包含子部门" defaultValue={isEdit ? isChildren : null} onChange={(val) => { this.getManagerType(val, index) }}>
            <Option label="是" value={1}>是</Option>
            <Option label="否" value={0}>否</Option>
          </Select>
        }
      },
      {
        title: '操作', dataIndex: 'operator', width: 80,
        render: (value, record) => {
          const { key } = record;
          return (
            <div>
              <Button type="primary" size="small" danger onClick={() => { this.deleteOrgList(key) }}>删除</Button>
            </div >
          );
        },
      },
    ];
    // debugger
    console.log(roleOrgTypeInfo)
    console.log(dataSource)
    return (
      <ModalContent
        loading={loading}
        okText="保存"
        cancelText="重置"
        onOk={() => this.form.submit()}
        onCancel={() => this.form.resetFields()}
      >
        <Form
          ref={form => this.form = form}
          onFinish={this.handleSubmit}
          initialValues={data}
        >
          {isEdit ? <FormItem {...formProps} type="hidden" name="id" /> : null}
          <FormItem
            {...formProps}
            label="角色名称"
            name="name"
            required
          />
          <FormItem
            {...formProps}
            label="部门是否私有"
            type="select"
            name="privateOrg"
            options={privateOrgOptions}
            initialValue={0}
            required
            labelTip="角色的部门是否私有"
          />
          <FormItem
            {...formProps}
            label="角色数据类型"
            type="select"
            name="roleOrgType"
            options={roleOrgTypeOptions}
            initialValue={0}
            onChange={(values) => this.getCurrentInfo(values)}
            required
            labelTip="角色可以查看的数据"
          />
          {roleOrgTypeInfo == 3 ? <FormItem
            {...formProps}
            label="部门"
            name="roleOrgList">
            <Button type="primary" size="small" onClick={() => this.addOrgList()}>添加部门</Button>
            <Table
              dataSource={dataSource} columns={columns}
              pagination={false}
              // showHeader={false}
              rowKey='key'
            />
          </FormItem> : null}
          <FormItem
            {...formProps}
            label="角色是否共享"
            type="select"
            name="shareRole"
            options={shareRoleOptions}
            initialValue={0}
            required
          />
          <FormItem
            {...formProps}
            label="角色是否有效"
            type="select"
            name="active"
            options={activeOptions}
            initialValue={1}
            required
          />
          <FormItem
            {...formProps}
            label="描述"
            name="remark"
          />
          <FormItem
            {...formProps}
            label="登录后默认首页"
            name="indexPage"
          />
        </Form>
      </ModalContent>
    );
  }
}
