import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Input, Button, Form, Row, Col } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { setLoginUser, toHome,locationHref } from 'src/commons';
import { preRouter } from 'src/commons/PRE_ROUTER'
import config from 'src/commons/config-hoc';
import Banner from './banner/index';
import './style.less';
import { AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER'

@config({
  path: '/login',
  ajax: true,
  noFrame: true,
  noAuth: true,
})
export default class Login extends Component {
  state = {
    loading: false,
    message: '',
    isMount: false,
    captchaData: {},
    showCaptcha: false
  };

  componentDidMount() {
    // 开发时方便测试，填写表单
    if (process.env.NODE_ENV === 'development' || process.env.PREVIEW) {
      this.form.setFieldsValue({ username: 'admin', password: 'admin' });
    }

    setTimeout(() => this.setState({ isMount: true }), 300);
  }

  //获取登录验证码
  getCaptcha = () => {
    this.props.ajax.post(`api/getCaptcha`, null, { errorTip: true, noEmpty: true }).then(res => {
      console.log(res);
      this.setState({
        captchaData: res.result
      })
    })
  }


  //登录提交操作
  handleSubmit = (values) => {
    if (this.state.loading) return;

    const { username, password, captcha } = values;
    const { showCaptcha } = this.state;
    const params = {
      account: username,
      password,
      captchaKey: showCaptcha ? this.state.captchaData.captchaKey : '',
      captcha: showCaptcha ? captcha : '',
    };
    this.setState({ loading: true, message: '' });
    console.log(params);
    this.props.ajax.post(`api/system/login`, params, { errorTip: true })
      .then(res => {
        // console.log(res);
        // debugger
        if (res.status == 'success' && res.statusCode == '200') {
          const { id, account, avatar, codes, codeMap } = res.result.user;
          setLoginUser({
            id,     // 必须字段
            name: account,   // 必须字段
            avatar: `${AJAX_PREFIXCONFIG}${avatar}`,
            token: res.result.jwttoken,
            permissions: codes,
            codeMap
            // 其他字段按需添加
          });
          localStorage.setItem("token", res.result.jwttoken);
          localStorage.setItem('userid', id)
          if(res.result.user.indexPage){
            locationHref(`${preRouter}${res.result.user.indexPage}`);
          }else{
            toHome();
          }
          // toHome();
        } else {
          if (res.result.showCaptcha) {

            this.setState({ showCaptcha: true }, () => { this.getCaptcha() })
          }
          this.setState({ loading: false, message: res.message })
        }


      })
      .catch((error) => { this.setState({ message: error }) })
      .finally(() => this.setState({ loading: false }));

  };

  render() {
    const { loading, message, isMount, captchaData, showCaptcha } = this.state;
    const formItemStyleName = isMount ? 'form-item active' : 'form-item';

    return (
      <div styleName="root">
        <Helmet title="欢迎登陆" />
        <div styleName="banner">
          <Banner />
        </div>
        <div styleName="box">
          <Form
            ref={form => this.form = form}
            name="login"
            className='inputLine'
            onFinish={this.handleSubmit}
          >
            <div styleName={formItemStyleName}>
              <div styleName="header">欢迎登录</div>
            </div>
            <div styleName={formItemStyleName}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input allowClear autoFocus prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
              </Form.Item>
            </div>
            <div styleName={formItemStyleName}>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="密码" />
              </Form.Item>
            </div>
            {
              showCaptcha ? <div styleName={formItemStyleName}>
                <Row gutter={24}>
                  <Col span={16}>
                    <Form.Item
                      name="captcha"
                      rules={[{ required: true, message: '请输入验证码' }]}
                    >
                      <Input prefix={<LockOutlined className="site-form-item-icon" />} placeholder="请输入验证码" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <img onClick={() => { this.getCaptcha() }} styleName='captchaStyle' src={captchaData.imageBase64} alt="" />

                  </Col>

                </Row>

              </div> : null
            }

            <div styleName={formItemStyleName}>
              <Form.Item shouldUpdate={true} style={{ marginBottom: 0 }}>
                {() => (
                  <Button
                    styleName="submit-btn"
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    disabled={
                      !this.form?.isFieldsTouched(true) ||
                      this.form?.getFieldsError().filter(({ errors }) => errors.length).length
                    }
                  >
                    登录
                  </Button>
                )}
              </Form.Item>
            </div>
          </Form>
          <div styleName="error-tip">{message}</div>
        </div>
      </div>
    );
  }
}

