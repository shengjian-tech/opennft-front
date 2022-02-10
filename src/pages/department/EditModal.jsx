import React, { Component } from 'react';
import { Form, message } from 'antd';
import { FormElement, FormRow, IconPicker, ModalContent, tree } from 'src/commons/ra-lib';
import config from 'src/commons/config-hoc';

export const active = [
    { value: 1, label: '有效' },
    { value: 0, label: '无效' },
];


const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
    ajax: true,
    modal: {
        width: 700,
        title: props => {
            const { data = {} } = props;
            const { pid, type } = data;
            const isMenu = type == 1;
            if (isMenu) { return '添加部门' } else { return '编辑部门' }
        },
    },
    connect: state => ({ layoutState: state.layout }),//获取当前选中
})
export default class EditModal extends Component {
    state = {
        loading: false,
        iconVisible: false,
        orgType: [

        ],
        menus: '',
    };

    componentDidMount() {
        this.handleSearch();
        this.handleDepartment();
    }

    handleSearch() {
        this.setState({ loading: true });
        this.props.ajax
            .post(`${this.props.layoutState.selectedMenu.pageUrl}`, { data: { menuType: 1 } })
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
                const menusList = function (list) {
                    list.forEach((row) => {
                        if (row.children) {
                            row.value = row.id
                            row.label = row.name
                            menusList(row.children)
                        } else {
                            row.value = row.id
                            row.label = row.name
                        }
                    });
                }
                menusList(menuTreeData)
                this.setState({ menus: menuTreeData });
            })
            .finally(() => this.setState({ loading: false }));
    }

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

    handleSubmit = (values) => {
        if (this.state.loading) return;
        const { data } = this.props;
        const { pid } = values;
        const { onOk } = this.props;
        if (values.comcodeList && values.comcodeList.length > 0) {
            values.pid = values.comcodeList[values.comcodeList.length - 1]
        }
        const ajaxUrl = data.type == 1 ? `${CODEMAP.t_department_add}` : `${CODEMAP.t_org_update}`;//type :1 新增 2,编辑
        this.setState({ loading: true });
        this.props.ajax.post(ajaxUrl, { ...values }).then((res) => {
            if (res.statusCode == '200' && res.status == 'success') {
                this.setState({ visible: false });
                message.success(res.message);
                onOk && onOk();
            } else {
                message.error(res.message);
            }
        }).finally(() => this.setState({ loading: false }));
    };

    handleCancel = () => {
        const { onCancel } = this.props;
        if (onCancel) onCancel();
    };

    render() {
        const { data } = this.props;
        const { loading, orgType, menus } = this.state;
        const { type, icon = 'bars' } = data;
        const isMenu = type == 1;
        const formProps = {
            width: 300,
            labelWidth: 100,
        };

        return (
            <ModalContent
                surplusSpace={false}
                loading={loading}
                okText="保存"
                onOk={() => this.form.submit()}
                cancelText="重置"
                onCancel={() => this.form.resetFields()}
            >
                <Form
                    ref={form => this.form = form}
                    onFinish={this.handleSubmit}
                    style={{ padding: 16 }}
                    initialValues={{ ...data, icon }}
                >
                    <FormElement {...formProps} type="hidden" name="id" />
                    <FormElement {...formProps} type="hidden" name="pid" />
                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="名称"
                            name="name"
                            required
                            autoFocus
                        />

                    </FormRow>
                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="部门类型"
                            type="select"
                            name="orgType"
                            required
                            options={orgType}
                            labelTip="部门的停用和启用"
                        />
                    </FormRow>

                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="是否有效"
                            type="select"
                            name="active"
                            options={active}
                            required
                            labelTip="部门的停用和启用"
                        />
                    </FormRow>
                    <FormRow>

                        <FormElement
                            {...formProps}
                            label="排序"
                            type="number"
                            name="sortno"
                            min={0}
                            step={1}
                        />
                    </FormRow>
                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="部门位置"
                            type="cascader"
                            name="comcodeList"
                            options={menus}
                            changeOnSelect
                        />
                    </FormRow>

                </Form>
            </ModalContent>
        );
    }
}
