import React from 'react';
import { Route } from 'react-router-dom';
import { isLogin, setLoginUser, locationHref } from 'src/commons';
import { message } from 'antd'
import { AJAX_PREFIXCONFIG, preRouter } from 'src/commons/PRE_ROUTER';
import config from 'src/commons/config-hoc';
import wx from 'weixin-js-sdk'
import { configConsumerProps } from 'antd/lib/config-provider';

/**
 * 未登录拦截
 * 前端判断是否登录，如果未登录直接跳转到登录页面
 */
@config({
  ajax: true,
})

export default class AuthRoute extends React.Component {
  componentDidMount() {
    // debugger
    // const code = this.geturl('code')
    // if (!isLogin() && code) {
    //   this.getToken(code)
    // }
  }

  geturl(name, string) {
    var reg = new RegExp('[^\?&]?' + encodeURI(name) + '=[^&]+')
    var arr = string.match(reg)
    if (arr != null) {
      return decodeURI(arr[0].substring(arr[0].search('=') + 1))
    }
    return ''
  }
  getToken(code) {// 获取token

  }
  //获取是否需要完善用户信息
  getIfInfo() {
    this.props.ajax.post(`/api/nft/login/haveCurrentUserInfo`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        sessionStorage.setItem('ifInfo', res.result)
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  render() {
    const {
      component: Component,
      noAuth,
      ...rest
    } = this.props;

    return (
      <Route
        {...rest}
        render={props => {
          const key = props.location.pathname;
          const appid = '' //请填入自己申请的appid
          // encodeURIComponent方法不会对下列字符编码 ASCII字母、数字、~!*()' 会编码&，但是会将//也编码   所以拼接起来保证参数不丢失
          const url = encodeURI(`https://makerone.shengjian.net${key}`) + encodeURIComponent(props.location.search)
          let code = this.geturl('code', props.location.search);
          //跳转路由时判断是否登录
          if (!isLogin()) {
            if (!code) {
              window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${url}&response_type=code&scope=snsapi_base&state=type&connect_redirect=1#wechat_redirect`;
            } else {
              this.props.ajax.get(`/api/nft/login/wechat?code=${code}`).then((res) => {
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
                } else {
                  message.error(res.message);
                }
              }).finally(() => {
                locationHref(`${key}${props.location.search}`)
              });
            }
          } else {
            if(!sessionStorage.getItem('ifInfo')){
              this.getIfInfo()
            }
            //全局分享，注意不可自定义分享内容
            // const ua = window.navigator.userAgent.toLowerCase()
            // if (ua.indexOf('micromessenger') < 0) return false
            // const url = encodeURI(`https://makerone.shengjian.net${key}`) + encodeURIComponent(props.location.search)
            // this.props.ajax.post(`/api/nft/wechat/sign/url?url=${url}`).then((res) => {
            //   if (res.status == 'success' && res.statusCode == '200') {
            //     wx.config({
            //       debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            //       appId: res.result.appId, // 必填，公众号的唯一标识
            //       timestamp:res.result.timestamp, // 必填，生成签名的时间戳
            //       nonceStr: res.result.nonceStr, // 必填，生成签名的随机串
            //       signature: res.result.jsApiSignature,// 必填，签名，见附录1
            //       jsApiList: [
            //       'updateAppMessageShareData',
            //       'updateTimelineShareData',
            //       'onMenuShareTimeline',
            //       'onMenuShareAppMessage'
            //       ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            //     })
            //     wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
            //       wx.updateAppMessageShareData({ 
            //         title: 'MakerOne', // 分享标题
            //         desc: `https://makerone.shengjian.net${key}${props.location.search}`, // 分享描述
            //         link: `https://makerone.shengjian.net${key}${props.location.search}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            //         // imgUrl: 'https://makerone.shengjian.net/api/nft/attachmentFile/2022-01-13T181907.82091d8cb5a-9484-4598-adac-77103a6a0260.png', // 分享图标
            //         success: function () {
            //           // message.success('分享成功')
            //         }
            //       })
            //       wx.updateTimelineShareData({ 
            //         title: 'MakerOne', // 分享标题
            //         link: `https://makerone.shengjian.net${key}${props.location.search}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            //         // imgUrl: 'https://makerone.shengjian.net/api/nft/attachmentFile/2022-01-13T181907.82091d8cb5a-9484-4598-adac-77103a6a0260.png', // 分享图标
            //         success: function () {
            //           // message.success('分享成功')
            //         }
            //       })
            //     });
            //   } else {
            //     message.error(res.message);
            //   }
            // })
            return <Component key={key} {...props} />
          }
        }}
      />
    );
  }
}
