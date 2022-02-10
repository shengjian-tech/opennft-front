import React, { Component } from 'react';
import { Button, Form, Row, Col, message, Popconfirm } from 'antd';
import { PageContent } from 'src/commons/ra-lib';
import config from 'src/commons/config-hoc';
import MenuSelect from 'src/pages/menus/MenuSelect';
import Permission from 'src/components/permission';
import {
  QueryBar,
  FormRow,
  FormElement,
  Table,
  Operator,
} from 'src/commons/ra-lib';
import EditModal from './EditModal';
import './style.less';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
  path: '/roles',
  ajax: true,
  connect: state => ({ layoutState: state.layout }),//获取当前选中
})
export default class UserCenter extends Component {
  state = {
    loading: false,     // 表格加载数据loading
    dataSource: [],     // 表格数据
    deleting: false,    // 删除中loading
    visible: false,     // 添加、修改弹框
    id: null,           // 需要修改的数据id
    loadingRoleMenu: false, // 查询角色权限 loading标识
    selectedKeys: [],   // 角色对应的菜单
    selectedRoleId: undefined, // 当前选中角色
  };

  columns = [
    { title: '角色名称', dataIndex: 'name', width: 150 },
    { title: '描述', dataIndex: 'description' },
    {
      title: '操作', dataIndex: 'operator', width: 120,
      render: (value, record) => {
        const { id, name } = record;
        return (
          <div>
            <Permission code={CODEMAP.t_role_update}>
              <Button type="link" size="small" onClick={(e) => { e.stopPropagation(); this.setState({ visible: true, id }) }}>修改</Button>
            </Permission>
            <Permission code={CODEMAP.t_role_delete}>
              <Popconfirm placement="topLeft" title='确定删除吗？' onClick={(e) => { e.stopPropagation() }} onConfirm={(e) => { e.stopPropagation(); this.handleDelete(id); }} okText="确定" cancelText="取消">
                <Button type="text" size="small" danger >删除</Button>
              </Popconfirm>
            </Permission>
          </div >
        );
      },
    },
  ];

  componentDidMount() {
    this.handleSubmit();
  }

  handleSubmit = (values) => {
    if (this.state.loading) return;
    const params = {
      data: values,
    };

    // 一般系统中，角色不会太多，不做分页查询了
    this.setState({ loading: true });
    this.props.ajax.post(`${this.props.layoutState.selectedMenu.pageUrl}`, params)
      .then(res => {
        const dataSource = res.result || [];

        this.setState({ dataSource });

        // 查询之后，默认选中第一个角色
        if (dataSource[0]) this.handleRowClick(dataSource[0]);
      })
      .finally(() => this.setState({ loading: false }));
  };

  handleDelete = (id) => {
    if (this.state.deleting) return;
    this.setState({ deleting: true });
    this.props.ajax.post(`${CODEMAP.t_role_delete}?id=${id}`, null)
      .then((res) => {
        if (res.statusCode == '200' && res.status == 'success') {
          message.success(res.message)
          this.form.submit()
        } else {
          message.error(res.message)
        }
      }
      )
      .finally(() => this.setState({ deleting: false }));
  };

  handleRowClick = (record) => {
    const { id } = record;
    this.setState({ selectedRoleId: id, selectedKeys: [] });
    // 根据id 获取 role对应的菜单权限
    const params = { roleId: id };
    this.setState({ loadingRoleMenu: true });
    this.props.ajax.post(`${CODEMAP.t_role_menu_list}?roleId=${id}`, params)
      .then(res => {
        let selectedKeysCont = [];
        res.result.forEach((row) => {
          selectedKeysCont.push(row.key);
        });
        this.setState({ selectedKeys: selectedKeysCont });
      })
      .finally(() => this.setState({ loadingRoleMenu: false }));
  };

  handleSaveRoleMenu = () => {
    const { selectedKeys, selectedRoleId } = this.state;
    const params = { roleId: selectedRoleId, menuIds: selectedKeys };
    this.setState({ loading: true });
    this.props.ajax.post(`${CODEMAP.t_role_menu_save}`, params)
      .then(res => {
        if (res.statusCode == '200' && res.status == 'success') {
          message.success(res.message)
        } else {
          message.error(res.message)
        }
      })
      .finally(() => this.setState({ loading: false }));
  };

  render() {
    const {
      loading,
      dataSource,
      visible,
      id,
      selectedRoleId,
      selectedKeys,
      loadingRoleMenu,
    } = this.state;

    const { form } = this.props;
    const formProps = {
      form,
      width: 220,
      style: { paddingLeft: 16 },
    };

    const selectedRoleName = dataSource.find(item => item.id === selectedRoleId)?.name;

    return (
      <PageContent styleName="root" loading={loading || loadingRoleMenu}>
        <QueryBar>
          <Form onFinish={this.handleSubmit} ref={form => this.form = form}>
            <FormRow>
              <FormElement
                {...formProps}
                label="角色名"
                name="name"
              />
              <FormElement layout>
                <Permission code={CODEMAP.t_role_list}>
                  <Button type="primary" htmlType="submit">查询</Button>
                </Permission>
                <Permission code={CODEMAP.t_role_save}>
                  <Button type="primary" onClick={() => this.setState({ visible: true, id: null })}>添加</Button>
                </Permission>

              </FormElement>
              <div styleName="role-menu-tip">
                {selectedRoleName ? <span>当前角色权限：「{selectedRoleName}」</span> : <span>请在左侧列表中选择一个角色！</span>}
                <Permission code={CODEMAP.t_role_menu_save}>
                  <Button disabled={!selectedRoleName} type="primary" onClick={this.handleSaveRoleMenu}>保存权限</Button>
                </Permission>

              </div>
            </FormRow>
          </Form>
        </QueryBar>
        <Row>
          <Col span={14}>
            <Table
              rowClassName={record => {
                if (record.id === selectedRoleId) return 'role-table selected';

                return 'role-table';
              }}
              serialNumber
              columns={this.columns}
              dataSource={dataSource}
              rowKey="id"
              onRow={(record, index) => {
                return {
                  onClick: () => this.handleRowClick(record, index),
                };
              }}
            />
          </Col>
          <Col span={10}>
            <MenuSelect
              value={selectedKeys}
              onChange={selectedKeys => this.setState({ selectedKeys })}
            />
          </Col>
        </Row>
        <EditModal
          visible={visible}
          id={id}
          isEdit={id !== null}
          onOk={() => this.setState({ visible: false }, this.form.submit)}
          onCancel={() => this.setState({ visible: false })}
        />
      </PageContent>
    );
  }
}
