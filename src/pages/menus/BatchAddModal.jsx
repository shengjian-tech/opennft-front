import React, { Component } from 'react';
import { Form, Alert, message } from 'antd';
import { FormElement, ModalContent } from 'src/commons/ra-lib';
import JSON5 from 'json5';
import config from 'src/commons/config-hoc';
const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
    ajax: true,
    modal: {
        width: 1000,
        title: '批量添加',
    },
})
export default class BatchAddModal extends Component {
    state = {
        loading: false,
        iconVisible: false,
    };

    handleSubmit = (values) => {
        if (this.state.loading) return;

        const { menus, parentKey } = values;
        let menusJson = JSON5.parse(menus);
        if (!Array.isArray(menusJson)) {
            menusJson = [menusJson];
        }
        menusJson.forEach(item => {
            if (!item.parentKey) item.parentKey = parentKey;
            if (!item.icon) item.icon = 'bars';

            item.id = item.key;
            item.parentId = item.parentKey;
        });

        const { onOk } = this.props;

        console.log(menusJson);

        this.setState({ loading: true });
        this.props.ajax.post(`${CODEMAP.t_menu_batchSave}`, menusJson)
            .then((res) => {
                if (res.statusCode == '200' && res.status == 'success') {
                    message.success(res.message)
                    this.setState({ visible: false });
                    onOk && onOk();
                } else {
                    message.error(res.message)
                }
            })
            .finally(() => this.setState({ loading: false }));
    };

    handleCancel = () => {
        const { onCancel } = this.props;
        if (onCancel) onCancel();
    };

    render() {
        const { data } = this.props;
        const { loading } = this.state;
        const alertMessage = `text，pathUrl，path必填！其他可选。type请填写：1 ,parentKey请填写：${data.parentKey}`
        const formProps = {
            labelWidth: 0,
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
                <Alert message={alertMessage} type="warning" showIcon closable />
                <Form
                    ref={form => this.form = form}
                    onFinish={this.handleSubmit}
                    style={{ padding: 16 }}
                    initialValues={{ ...data }}
                >
                    <FormElement {...formProps} type="hidden" name="parentKey" />
                    <FormElement
                        {...formProps}
                        type="textarea"
                        label="名称"
                        name="menus"
                        colon={false}
                        rows={20}
                        required
                        autoFocus
                        rules={[
                            {
                                validator: (rule, value) => {
                                    if (!value) return Promise.resolve();

                                    try {
                                        JSON5.parse(value);
                                        return Promise.resolve();
                                    } catch (e) {
                                        return Promise.reject(e.message);
                                    }
                                },
                            },
                        ]}
                        placeholder={

                            `批量添加子菜单，格式如下：
                            [
                                {
                                    "text": "测试1",
                                    "icon": "",
                                    "pathUrl": "/path",
                                    "path": "/path",
                                    "url": "",
                                    "target": "",
                                    "type": "1",
                                    "parentKey": "${data.parentKey}",
                                    "order":"11"
                                },
                                {
                                    "text": "测试",
                                    "icon": "",
                                    "pathUrl": "/path",
                                    "path": "/path",
                                    "url": "",
                                    "target": "",
                                    "type": "1",
                                    "parentKey": "${data.parentKey}"
                                    "order":"10"
                                }
                            ]
                        `
                        }
                    />
                </Form>
            </ModalContent>
        );
    }
}
