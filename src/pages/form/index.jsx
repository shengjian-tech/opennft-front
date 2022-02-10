import React, { useState, useEffect } from 'react';
import config from 'src/commons/config-hoc';
import { PageContent, FormItem } from 'src/commons/ra-lib';

import { Form, Col, Row, Button, DatePicker, Cascader, Switch, Checkbox } from 'antd';

const formLayout = {
    labelCol: {
        flex: '100px',
    },
};


export default config({
    path: '/form',
    title: { text: '复杂表单', icon: 'align-left' },
    side: true,
})(props => {
    const [form] = Form.useForm();
    const [data, setData] = useState({});


    async function handleSubmit(res) {//表单提交方法
        console.log(res)
    }

    async function fetchData() {//初始化表单的操作

    }

    useEffect(() => {//表单初始化  
        (async () => {
            await fetchData();
        })();
    }, []);




    return (
        <PageContent fitHeight>
            <Form
                form={form}
                onFinish={handleSubmit}
                initialValues={data}
            >
                <Col flex={1}>
                    <FormItem
                        {...formLayout}
                        label="用户名"
                        name="name"
                        required
                        noSpace
                    />
                </Col>
                <FormItem
                    {...formLayout}
                    type="number"
                    label="年龄"
                    name="age"
                    required
                />
                <FormItem
                    {...formLayout}
                    type="select"
                    label="工作"
                    name="job"
                    options={[
                        { value: '1', label: '前端开发' },
                        { value: '2', label: '后端开发' },
                    ]}
                />
                <FormItem
                    {...formLayout}
                    type="select"
                    label="角色"
                    name="role"
                    mode="multiple"
                    showSearch
                    optionFilterProp='children'
                    options={[
                        { value: '1', label: '员工' },
                        { value: '2', label: 'CEO' },
                    ]}
                />

                <FormItem
                    {...formLayout}
                    type="time"
                    label="时间"
                    name="time"
                >
                    <DatePicker />
                </FormItem>
                <FormItem
                    {...formLayout}
                    type="cascader"
                    label="来源"
                    name="cascader"
                >
                    <Cascader
                        options={[
                            {
                                value: 'zhejiang',
                                label: 'Zhejiang',
                                children: [
                                    {
                                        value: 'hangzhou',
                                        label: 'Hangzhou',
                                    },
                                ],
                            },
                        ]}
                    />
                </FormItem>
                <FormItem
                    {...formLayout}
                    type="switch"
                    label="是否第一次使用"
                    name="switch"
                >
                    <Switch />
                </FormItem>
                <FormItem
                    {...formLayout}
                    type="checkbox"
                    label="熟悉哪些技能"
                    name="checkbox"
                >
                    <Checkbox.Group>
                        <Row>
                            <Col span={8}><Checkbox value="A" style={{ lineHeight: '32px' }}>A</Checkbox></Col>
                            <Col span={8}><Checkbox value="B" style={{ lineHeight: '32px' }} disabled>B</Checkbox></Col>
                            <Col span={8}><Checkbox value="C" style={{ lineHeight: '32px' }}>C</Checkbox></Col>
                            <Col span={8}><Checkbox value="D" style={{ lineHeight: '32px' }}>D</Checkbox></Col>
                            <Col span={8}><Checkbox value="E" style={{ lineHeight: '32px' }}>E</Checkbox></Col>
                            <Col span={8}><Checkbox value="F" style={{ lineHeight: '32px' }}>F</Checkbox></Col>
                        </Row>
                    </Checkbox.Group>
                </FormItem>
                <Col flex={1}>
                    <FormItem >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </FormItem>
                </Col>



            </Form>
        </PageContent>
    );
});
