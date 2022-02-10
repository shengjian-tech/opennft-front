import React, { useState, useEffect } from 'react';
import config from 'src/commons/config-hoc';
import { PageContent, FormItem } from 'src/commons/ra-lib';
import { Card, Divider, Avatar, Form, notification, Button, Upload, message } from 'antd';
import { AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER'
import {
  UserOutlined,
  WomanOutlined,
  PhoneOutlined,
  MailOutlined,
  SubnodeOutlined,
  UserSwitchOutlined,
  ScheduleOutlined
} from '@ant-design/icons';
import './style.less'
const formLayout = {
  labelCol: {
    flex: '100px',
  },
};

export default config({
  ajax: true,
  side: true,
})((props) => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState(null);
  const [orgList, setOrgList] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, fetchUsers] = props.ajax.usePost(`api/system/user/info`);
  const [saving, saveUser] = props.ajax.usePost(`api/system/user/updateSelf`);
  async function handleSearch() {
    if (loading) return;
    const res = await fetchUsers();

    setDataSource(res?.result || {});
    res.result.orgList.forEach((item) => {
      const arr1 = []
      arr1.push(item.name)
      setOrgList(arr1)
    })
    res.result.roles.forEach((item) => {
      const arr2 = []
      arr2.push(item.name)
      setRoles(arr2)
    })
    form.resetFields()
  }
  async function handleSubmit(values) {
    if (saving) return;
    await saveUser(values).then(res => {
      if (res.statusCode != 200) {
        notification.error({
          message: res.message,
          duration: 2,
        });
      } else {
        notification.success({
          message: res.message,
          duration: 2,
        });
        handleSearch()
      }
    });
  }
  function beforeUpload(file) {
    const isXls = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
    if (!isXls) {
      message.error('请确定您上传的文件格式!');
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error('文件大小不能超过20MB!');
    }
    return isXls && isLt2M;
  }
  function customRequest(options) {
    let params = new FormData();
    params.append("avatar", options.file);
    props.ajax.post(`api/system/user/updateAvatar`, params, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
      if (res.statusCode == 200) {
        message.success(res.message)
        handleSearch()
      } else {
        message.error(res.message)
      }
    })
  }
  // 组件初始化完成之后，进行一次查询  初始化搜索。
  useEffect(() => {
    (async () => {
      await handleSearch();
    })();
  }, []);
  return (
    <PageContent style={{ minWidth: '950px' }}>
      <div style={{
        float: 'left',
        width: '30%',
        minWidth: '400px'
      }}>
        <Card title="个人信息" >
          <div style={{ textAlign: 'center' }}>
            <Upload
              accept=".jpg,.png,.jpeg"
              customRequest={customRequest}
              beforeUpload={beforeUpload}
              // fileList={fileList}
              showUploadList={false}
            >
              <Avatar
                src={dataSource ? `${AJAX_PREFIXCONFIG}` + dataSource.avatar : ''}
                size={150}
              />
            </Upload>
          </div>

          <Divider />
          <div styleName='content'>
            <ul>
              <li>
                <span><UserOutlined />&nbsp;&nbsp;用户名称</span>
                <span style={{ float: 'right' }}>{dataSource?.userName || ''}</span>
              </li>
              <Divider />
              <li>
                <span><WomanOutlined />&nbsp;&nbsp;性别</span>
                <span style={{ float: 'right' }}>{dataSource?.sex || ''}</span>
              </li>
              <Divider />
              <li>
                <span><PhoneOutlined />&nbsp;&nbsp;手机号码</span>
                <span style={{ float: 'right' }}>{dataSource?.mobile || ''}</span>
              </li>
              <Divider />
              <li>
                <span><MailOutlined />&nbsp;&nbsp;用户邮箱</span>
                <span style={{ float: 'right' }}>{dataSource?.email || ''}</span>
              </li>
              <Divider />
              <li>
                <span><SubnodeOutlined />&nbsp;&nbsp;所属部门</span>
                <span style={{ float: 'right' }}>{orgList}</span>
              </li>
              <Divider />
              <li>
                <span><UserSwitchOutlined />&nbsp;&nbsp;所属角色</span>
                <span style={{ float: 'right' }}>{roles}</span>
              </li>
              <Divider />
              <li>
                <span><ScheduleOutlined />&nbsp;&nbsp;创建日期</span>
                <span style={{ float: 'right' }}>{dataSource?.createTime || ''}</span>
              </li>
              <Divider />
            </ul>
          </div>
        </Card>
      </div>
      <div style={{ float: 'left', marginLeft: '50px', width: '50%' }}>
        <Card title="基本资料">
          <Form form={form}
            onFinish={handleSubmit}
            initialValues={dataSource}>
            <FormItem
              {...formLayout}
              label="用户名称"
              name="userName"
              required
            />
            <FormItem
              {...formLayout}
              type="mobile"
              label="手机号码"
              name="mobile"
              required
            />
            <FormItem
              {...formLayout}
              type="email"
              label="邮箱"
              name="email"
              required
            />
            <FormItem
              {...formLayout}
              type="radio-group"
              label="性别"
              name="sex"
              options={[
                { value: "男", label: '男' },
                { value: "女", label: '女' },
              ]}
              required
            />
            <FormItem
              {...formLayout}>
              <Button type="primary" htmlType="submit" style={{ marginLeft: '100px' }}>
                保存
              </Button>
              <Button onClick={() => form.resetFields()} style={{ marginLeft: '20px' }}>
                重置
              </Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    </PageContent>
  );
});
