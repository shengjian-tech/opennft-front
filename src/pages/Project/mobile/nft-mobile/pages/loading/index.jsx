import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { message } from 'antd';
import { Result } from 'antd-mobile'
import { setLoginUser,toHome } from 'src/commons';
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER';
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
    if(geturl('jwttoken')){
      this.getIfInfo()
      this.getWTinfo()
    }
  }
  //获取登录信息
  getWTinfo(){
    const params = {}
    const jwttoken = geturl('jwttoken')
    this.props.ajax.post(`/api/nft/login/findUserPermissions`, params,{ headers: { 'jwttoken': jwttoken} }).then(res =>{
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
    }).finally(() => this.setState({ loading: false }));
  }
  //获取是否需要完善用户信息
  getIfInfo(){
    const params = {}
    const jwttoken = geturl('jwttoken')
    this.props.ajax.post(`/api/nft/login/haveCurrentUserInfo`, params,{ headers: { 'jwttoken': jwttoken} }).then(res =>{
      if (res.status == 'success' && res.statusCode == '200') {
        sessionStorage.setItem('ifInfo',res.result)
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  render() {
    return (
      <div styleName='loading'>
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