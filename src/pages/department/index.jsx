import React, { Component } from 'react';
import { Button, Popconfirm, Tooltip, Form, Space, message } from 'antd';
import { Icon, PageContent, tree, Table, QueryBar, FormElement } from 'src/commons/ra-lib';
import config from 'src/commons/config-hoc';
import EditModal, { targetOptions } from './EditModal';
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
    path: '/department',
    ajax: true,
    connect: state => ({ layoutState: state.layout }),//获取当前选中
})
export default class index extends Component {
    state = {
        loading: false,
        menus: [],
        visible: false,
        batchAddVisible: false,
        record: {},
        iconVisible: false,
        orgType: []
    };

    columns = [
        {
            title: '名称', dataIndex: 'name', key: 'name', width: 150,
            render: (value, record) => {
                const { icon } = record;

                if (icon) return <span><Icon type={icon} /> {value}</span>;

                return value;
            },
        },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 100 },
        { title: '类型', dataIndex: 'orgTypeName', key: 'orgTypeName', width: 100 },
        {
            title: '是否有效', dataIndex: 'active', key: 'active', width: 60,
            render: (value, record) => {
                return (value == 1 ? <span style={{ color: 'green' }}>有效</span> : <span style={{ color: 'red' }}>无效</span>)
            },
        },
        // { title: '功能编码', dataIndex: 'code', key: 'code', width: 100 },
        { title: '排序', dataIndex: 'sortno', key: 'sortno', width: 60 },
        {
            title: '操作', dataIndex: 'operator', key: 'operator', width: 180,
            render: (value, record) => {
                // 要有type
                const { type } = record;
                return (
                    <span>
                        <Permission code={CODEMAP.t_org_update}>
                            <Button type="link" size="small" onClick={() => { this.setState({ data: { ...record, type: 2 }, visible: true }) }} >编辑</Button>
                        </Permission>
                        <Permission code={CODEMAP.t_org_delete}>
                            <Popconfirm placement="topLeft" title='确定删除吗？' onConfirm={() => { this.handleDeleteNode(record) }} okText="确定" cancelText="取消">
                                <Button type="text" size="small" danger >删除</Button>
                            </Popconfirm>
                        </Permission>
                        <Permission code={CODEMAP.t_department_add}>
                            <Button type="link" size="small" onClick={() => { this.setState({ data: { pid: record.id, type: 1 }, visible: true }) }} >添加子部门</Button>
                        </Permission>

                    </span>
                )
            },
        },
    ];

    componentDidMount() {
        this.handleSearch();
        this.handleDepartment();
    }
    //部门搜索和初始化
    handleSearch = (values) => {
        this.setState({ loading: true });
        let searchData;
        if (values) searchData = values;
        this.props.ajax
            .post(`${this.props.layoutState.selectedMenu.pageUrl}`, { data: searchData })
            .then(res => {

                const menus = res.result.map(item => ({ key: item.id, parentKey: item.pid, ...item }));
                // 菜单根据order排序
                const orderedData = [...menus].sort((a, b) => {
                    const aOrder = a.order || 0;
                    const bOrder = b.order || 0;
                    return bOrder - aOrder;
                });

                const menuTreeData = tree.convertToTree(orderedData);
                console.log(menuTreeData)
                this.setState({ menus: menuTreeData });
            })
            .finally(() => this.setState({ loading: false }));
    }
    //添加部门
    handleAddTopMenu = () => {
        this.setState({ data: { type: 1 }, visible: true });
    };
    // 删除部门
    handleDeleteNode = (record) => {
        const { id } = record;
        this.setState({ loading: true });
        this.props.ajax
            .post(`${CODEMAP.t_org_delete}?id=${id}`, { successTip: '删除成功！', errorTip: '删除失败！' })
            .then(() => {
                this.setState({ visible: false });
                this.handleSearch();
            })
            .finally(() => this.setState({ loading: false }));
    };
    //部门类型
    handleDepartment = () => {
        const departmentUrl = `${CODEMAP.t_org_type_list}`;
        const departmentData = []
        this.props.ajax.post(departmentUrl).then(res => {
            if (res.statusCode == '200' && res.status == 'success') {
                res.result.forEach((resf, i) => {
                    departmentData[i] = {
                        value: Number(resf.val),//转成数字
                        label: resf.name
                    }
                });
                this.setState({ orgType: departmentData })
            } else {
                message.error(res.message);
            }
        })
    }
    // 重置搜索
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
            form,
            orgType
        } = this.state;
        const formLayout = {
            width: 220
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
                            type='select'
                            label="类型"
                            name="orgType"
                            options={orgType}
                            onChange={() => this.handleSearch}
                        />
                        <FormElement
                            {...formLayout}
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
                                <Permission code={CODEMAP.t_department_add}>
                                    <Button type="primary" onClick={this.handleAddTopMenu}>添加部门</Button>
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

            </PageContent>
        );
    }
}

