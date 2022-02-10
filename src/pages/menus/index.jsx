import React, { Component } from 'react';
import { Button, Popconfirm, Tooltip, Form, Space } from 'antd';
import { Icon, PageContent, tree, Table, ToolBar, QueryBar, FormElement } from 'src/commons/ra-lib';
import config from 'src/commons/config-hoc';
import EditModal, { targetOptions } from './EditModal';
import BatchAddModal from './BatchAddModal';
import Permission from 'src/components/permission';
import {
    DeleteTwoTone,
    EditTwoTone,
    FolderAddTwoTone,
    ContainerTwoTone,
    FileAddTwoTone,
} from '@ant-design/icons';
import './style.less';
import { ShakeOutlined } from '@ant-design/icons/es/icons';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
    path: '/menus',
    ajax: true,
    connect: state => (console.log(state)),//获取当前选中
})

export default class index extends Component {
    state = {
        loading: false,
        menus: [],
        visible: false,
        batchAddVisible: false,
        record: {},
        iconVisible: false,
        form: ""
    };

    columns = [
        {
            title: '名称', dataIndex: 'text', key: 'text', width: 150,
            render: (value, record) => {
                const { icon } = record;

                if (icon) return <span><Icon type={icon} /> {value}</span>;

                return value;
            },
        },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 100 },
        {
            title: '类型', dataIndex: 'type', key: 'type', width: 60,
            render: (value, record) => {
                const { url } = record;
                if (url) return <span style={{ color: 'purple' }}>外站</span>;
                if (value === 1) return <span style={{ color: 'green' }}>导航菜单</span>;
                if (value === 0) return <span style={{ color: 'orange' }}>功能按钮</span>;

                // return <span style={{ color: 'green' }}>菜单</span>;
            },
        },
        {
            title: '是否有效', dataIndex: 'active', key: 'active', width: 60,
            render: (value, record) => {
                return (value == 1 ? <span style={{ color: 'green' }}>有效</span> : <span style={{ color: 'red' }}>无效</span>)
            },
        },
        // { title: '功能编码', dataIndex: 'code', key: 'code', width: 100 },
        { title: '排序', dataIndex: 'order', key: 'order', width: 60 },
        {
            title: '操作', dataIndex: 'operator', key: 'operator', width: 180,
            render: (value, record) => {
                // 要有type
                const { type } = record;
                return (
                    <span>
                        <Permission code={CODEMAP.t_menu_update}>
                            <Button type="link" size="small" onClick={() => { this.setState({ data: { ...record, type }, visible: true }) }}>编辑</Button>
                        </Permission>
                        <Permission code={CODEMAP.t_menu_delete}>
                            <Popconfirm placement="topLeft" title='确定删除吗？' onConfirm={() => { this.handleDeleteNode(record) }} okText="确定" cancelText="取消">

                                <Button type="text" size="small" danger >删除</Button>

                            </Popconfirm>
                        </Permission>
                        <Permission code={CODEMAP.t_menu_save}>

                            <Button type="link" size="small" onClick={() => { this.setState({ data: { parentKey: record.key, type: 1 }, visible: true }) }} >添加子菜单</Button>

                        </Permission>
                        <Permission code={CODEMAP.t_menu_save}>

                            <Button type="link" size="small" onClick={() => { this.setState({ data: { parentKey: record.key, type: 0 }, visible: true }) }} >添加子功能</Button>

                        </Permission>
                        {
                            type == 1 ? <Permission code={CODEMAP.t_menu_batchSave}>

                                <Button type="link" size="small"
                                    onClick={() => { this.setState({ data: { parentKey: record.key }, batchAddVisible: true }) }} >批量添加子菜单</Button>

                            </Permission> : null
                        }
                    </span >
                )
            },
        },
    ];

    componentDidMount() {
        this.handleSearch();
    }

    handleSearch = (values) => {
        // debugger
        let searchData;
        if (values) searchData = values;
        this.setState({ loading: true });
        this.props.ajax
            .post(`${CODEMAP.t_menu_list}`, { data: searchData })
            .then(res => {
                const menus = res.result.map(item => ({ key: item.id, parentKey: item.pid, ...item }));
                // 菜单根据order排序
                const orderedData = [...menus].sort((a, b) => {
                    const aOrder = a.order || 0;
                    const bOrder = b.order || 0;
                    return bOrder - aOrder;
                });

                const menuTreeData = tree.convertToTree(orderedData);
                this.setState({ menus: menuTreeData });
            })
            .finally(() => this.setState({ loading: false }));
    }

    handleAddTopMenu = () => {
        this.setState({ data: { type: 1 }, visible: true });
    };

    handleDeleteNode = (record) => {
        const { key } = record;
        this.setState({ loading: true });
        this.props.ajax
            .post(`${CODEMAP.t_menu_delete}?id=${key}`, { successTip: '删除成功！', errorTip: '删除失败！' })
            .then(() => {
                this.setState({ visible: false });
                this.handleSearch();
            })
            .finally(() => this.setState({ loading: false }));
    };
    resetFields = (form) => {
        this.form.resetFields();
        this.handleSearch();
    }

    render() {
        const {
            menus,
            visible,
            batchAddVisible,
            loading,
            data,
            form
        } = this.state;
        const formLayout = {
            width: '260px'
        };
        const formLayout1 = {
          width:'200px'
        }
        return (
            <PageContent styleName="root">
                <QueryBar>
                    <Form
                        ref={form => this.form = form}
                        layout="inline"
                        form={form}
                        onFinish={(values) => this.handleSearch(values)}
                    >
                        <FormElement
                            {...formLayout}
                            label="名称"
                            name="name"
                        />
                        <FormElement
                            {...formLayout}
                            label="权限Code"
                            name="code"
                        />
                        <FormElement
                            {...formLayout}
                            label="请求地址"
                            name="pageurl"
                        />
                        <FormElement
                            {...formLayout1}
                            type='select'
                            label="类型"
                            name="menuType"
                            options={[
                                { value: 1, label: "导航菜单" },
                                { value: 0, label: "功能按钮" },
                            ]}
                            onChange={() => this.handleSearch}
                        />
                        <FormElement
                            {...formLayout1}
                            label="是否有效"
                            name="active"
                            type='select'
                            options={[
                                { value: 1, label: "是" },
                                { value: 0, label: "否" },
                            ]}
                            onChange={() => this.handleSearch}
                        />
                        <FormElement>
                            <Space>
                                <Button type="primary" htmlType="submit">查询</Button>
                                <Button onClick={(form) => this.resetFields(form)}>重置</Button>
                                <Permission code={CODEMAP.t_menu_save}>
                                    <Button type="primary" onClick={this.handleAddTopMenu}>添加菜单</Button>
                                </Permission>
                            </Space>
                        </FormElement>
                    </Form>
                </QueryBar>

                <Table
                    loading={loading}
                    columns={this.columns}
                    dataSource={menus}
                    pagination={false}
                    rowKey="key"
                />
                <EditModal
                    visible={visible}
                    data={data}
                    onOk={() => this.setState({ visible: false }, this.handleSearch)}
                    onCancel={() => this.setState({ visible: false })}
                />
                <BatchAddModal
                    visible={batchAddVisible}
                    data={data}
                    onOk={() => this.setState({ batchAddVisible: false }, this.handleSearch)}
                    onCancel={() => this.setState({ batchAddVisible: false })}
                />
            </PageContent>
        );
    }
}

