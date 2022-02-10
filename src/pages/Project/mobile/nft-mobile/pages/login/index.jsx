import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { Form, message,Input,Row,Col } from 'antd';
import { Link } from 'react-router-dom'
import { Button,Result } from 'antd-mobile'
import { setLoginUser,toHome,isLogin } from 'src/commons';
import { UserOutlined } from '@ant-design/icons';
import {  FormItem } from 'src/commons/ra-lib';
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER';
import wx from 'weixin-js-sdk'
import './style.less';

function geturl(name) {
  var reg = new RegExp('[^\?&]?' + encodeURI(name) + '=[^&]+')
  var arr = window.location.search.match(reg)
  if (arr != null) {
    return decodeURI(arr[0].substring(arr[0].search('=') + 1))
  }
  return ''
}

@config({
  path: '/login',
  ajax: true,
  noFrame: true,
  noAuth: true,
})

export default class Login extends Component {
  state = {
    loading: false,
  };
  
  componentDidMount() {
    const code = geturl('code')
    this.getToken(code)
  }
  getOpenId(appid,code,secret){
    this.props.ajax.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`).then((res)=>{
      this.getToken(res.openid)
    })
  }
  getToken(code){
    this.props.ajax.get(`/api/nft/login/wechat?code=${code}`).then((res)=>{
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
        // locationHref(`${preRouter}/nft_mobile_home`)
        toHome();
      } else {
        message.error(res.message);
      }
    })
    if(isLogin()){
      this.getIfInfo()
    }
    // this.getIfInfo()
  }
  //获取是否需要完善用户信息
  getIfInfo(){
    this.props.ajax.post(`/api/nft/login/haveCurrentUserInfo`).then(res =>{
      if (res.status == 'success' && res.statusCode == '200') {
        sessionStorage.setItem('ifInfo',res.result)
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  render() {
    return (
      <div styleName='login'>
        <div styleName='header'>
          <img src={require('../../assets/logo.png')} alt="" />
        </div>
        <Result
          status='waiting'
          title='等待处理'
          description='正在努力登录中，请您稍后哦'
        />
      </div >
    );
  }
}

