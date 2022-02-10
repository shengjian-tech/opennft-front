import React, { Component } from 'react';
import { Form, message, Cascader } from 'antd';
import { FormElement, FormRow, IconPicker, ModalContent, tree } from 'src/commons/ra-lib';
import config from 'src/commons/config-hoc';

export const targetOptions = [
    { value: '', label: '项目内部窗口' },
    { value: '_self', label: '替换当前窗口' },
    { value: '_blank', label: '打开新窗口' },
];

export const activeOptions = [
    { value: 1, label: '有效' },
    { value: 0, label: '无效' },
];

export const menus = []

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
    ajax: true,
    modal: {
        width: 700,
        title: props => {
            const { data = {} } = props;
            const { key, type } = data;
            const isMenu = type == 1;

            if (isMenu) return key ? '编辑菜单' : '添加菜单';

            return key ? '编辑功能' : '添加功能';
        },
    },
    connect: state => ({ layoutState: state.layout }),//获取当前选中
})
export default class EditModal extends Component {
    state = {
        loading: false,
        iconVisible: false,
        menus: '',

    };

    componentDidMount() {
        //获取菜单所有数据，不包括功能
        this.handleSearch();
    }

    handleSearch() {
        this.setState({ loading: true });
        this.props.ajax
            .post(`${CODEMAP.t_menu_list}`, { data: { menuType: 1 } })
            .then(res => {
                const menus = res.result.map(item => ({ key: item.id, parentKey: item.pid, ...item }));
                // 菜单根据order排序
                const orderedData = [...menus].sort((a, b) => {
                    const aOrder = a.order || 0;
                    const bOrder = b.order || 0;
                    return bOrder - aOrder;
                });
                const menuTreeData = tree.convertToTree(orderedData);
                const menusList = function (list) {
                    list.forEach((row) => {
                        if (row.children) {
                            row.value = row.key
                            row.label = row.text
                            menusList(row.children)
                        } else {
                            row.value = row.key
                            row.label = row.text
                        }
                    });
                }
                menusList(menuTreeData)
                this.setState({ menus: menuTreeData });
            })
            .finally(() => this.setState({ loading: false }));
    }

    handleSubmit = (values) => {
        console.log(values)
        if (values.comcode && values.comcode.length > 0) {
            values.parentKey = values.comcode[values.comcode.length - 1]
        }
        if (this.state.loading) return;
        values.type = values.type
        const { key } = values;
        const { onOk } = this.props;
        const ajaxUrl = key ? `${CODEMAP.t_menu_update}` : `${CODEMAP.t_menu_save}`;
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

    onChange = (e) => {
        console.log(e)
    }

    render() {
        const { data } = this.props;
        const { loading, menus } = this.state;
        const { type, icon = 'bars' } = data;
        const isMenu = type == 1 ? true : false;
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
                    <FormElement {...formProps} type="hidden" name="key" />
                    <FormElement {...formProps} type="hidden" name="parentKey" />
                    <FormElement {...formProps} type="hidden" name="type" />
                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="名称"
                            name="text"
                            required
                            autoFocus
                        />

                        {isMenu ? (
                            <FormElement
                                {...formProps}
                                width={180}
                                label="图标"
                                name="icon"
                            >
                                <IconPicker />
                            </FormElement>
                        ) : (
                            <FormElement
                                {...formProps}
                                width="auto"
                                label="编码"
                                name="code"
                                required
                                labelTip="唯一标识，硬编码，前端一般会用于控制按钮是否显示。"
                            />
                        )}

                        {isMenu ? (
                            <FormElement
                                {...formProps}
                                labelWidth="auto"
                                width={120}
                                label="排序"
                                type="number"
                                name="order"
                                min={0}
                                step={1}
                            />
                        ) : null}
                    </FormRow>
                    <FormRow>

                        <FormElement
                            {...formProps}
                            label="请求路径"
                            name="pageUrl"
                            required
                            labelTip="菜单对应的页面初始化请求地址"
                        />
                        {isMenu ? (
                            <FormElement
                                {...formProps}
                                label="路径(path)"
                                name="path"
                                labelTip="菜单对应的页面地址，或者功能对应的页面地址。前端会基于用户所拥有的「路径」，对路由进行过滤。"
                            />
                        ) : null}

                    </FormRow>
                    {isMenu ? (
                        <FormRow>
                            <FormElement
                                {...formProps}
                                label="url"
                                name="url"
                                labelTip="iframe方式接入第三方网站的url，如果存在「基础路径」，会与基础路径进行拼接。"
                            />
                            <FormElement
                                {...formProps}
                                type="select"
                                label="target"
                                name="target"
                                options={targetOptions}
                                labelTip="iframe方式接入的第三方网站打开方式。"
                            />
                        </FormRow>
                    ) : null}
                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="是否有效"
                            type="select"
                            name="active"
                            options={activeOptions}
                            labelTip="菜单的停用和启用"
                        />
                        <FormElement
                            {...formProps}
                            label="菜单位置"
                            type="cascader"
                            name="comcode"
                            options={menus}
                            changeOnSelect
                        />
                        {/* <Cascader options={menus} onChange={this.onChange} changeOnSelect /> */}
                    </FormRow>
                </Form>
            </ModalContent>
        );
    }
}
