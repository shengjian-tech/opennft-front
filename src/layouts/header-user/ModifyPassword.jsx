import React, { Component } from 'react';
import { Form, message, notification } from 'antd';
import config from 'src/commons/config-hoc';
import { FormElement, ModalContent, PageContent } from 'src/commons/ra-lib';
import { toLogin } from 'src/commons';

@config({
    ajax: true,
    connect: state => ({ loginUser: state.layout.loginUser }),
    modal: {
        title: '修改密码',
        width: 420,
    },
})
export default class ModifyPassword extends Component {
    state = {
        loading: false,
    };

    handleOk = (values) => {
        if (this.state.loading) return;
        const { onOk } = this.props;

        this.setState({ loading: true });
        this.props.ajax.post('api/system/user/updateSelfPassword', values)
            .then(res => {
                if (onOk) onOk();
                if (res.statusCode == 200) {
                    notification.success({
                        message: res.message + '请重新登录！',
                        duration: 2,
                    })
                    setTimeout(() => {
                        toLogin()
                    }, 1000);
                } else {
                    notification.error({
                        message: res.message,
                        duration: 2,
                    })
                }
            })
            .finally(() => this.setState({ loading: false }));
    };

    handleCancel = () => {
        const { onCancel } = this.props;
        if (onCancel) onCancel();
    };

    render() {
        const { loginUser } = this.props;
        const id = loginUser?.id;
        const { loading } = this.state;
        const labelWidth = 100;

        return (
            <ModalContent
                loading={loading}
                surplusSpace={false}
                onOk={() => this.form.submit()}
                onCancel={this.handleCancel}
            >
                <PageContent>
                    <Form ref={form => this.form = form} onFinish={this.handleOk} initialValues={{ id }}>
                        {/* <FormElement type="hidden" name="id" /> */}

                        {/* <FormElement
                            label="当前账号"
                            labelWidth={labelWidth}
                            layout
                            colon
                        >{loginUser?.account}</FormElement> */}

                        <FormElement
                            label="原密码"
                            labelWidth={labelWidth}
                            type="password"
                            name="oldPwd"
                            autoFocus
                            required
                            placeholder="初始化密码为123"
                        />
                        <FormElement
                            label="新密码"
                            labelWidth={labelWidth}
                            type="password"
                            name="newPwd"
                            required
                        />
                        <FormElement
                            label="确认密码"
                            labelWidth={labelWidth}
                            type="password"
                            name="reNewPassword"
                            dependencies={['password']}
                            required
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('newPwd') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('新密码与确认新密码不同！');
                                    },
                                }),
                            ]}
                        />
                    </Form>
                </PageContent>
            </ModalContent>
        );
    }
}

