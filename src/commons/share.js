import wx from 'weixin-js-sdk';
import { ajax } from "src/commons/ajax";
import { message } from 'antd'

		//要用到微信API								
export function getJSSDK(title,desc,img) {
  
  const key = window.location.pathname;
  const ua = window.navigator.userAgent.toLowerCase()
  
  if (ua.indexOf('micromessenger') < 0) return false
  const url = encodeURI(`https://makerone.shengjian.net${key}`) + encodeURIComponent(window.location.search)
  ajax.post(`/api/nft/wechat/sign/url?url=${url}`).then((res) => {
    if (res.status == 'success' && res.statusCode == '200') {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.result.appId, // 必填，公众号的唯一标识
        timestamp:res.result.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.result.nonceStr, // 必填，生成签名的随机串
        signature: res.result.jsApiSignature,// 必填，签名，见附录1
        jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareTimeline',
        'onMenuShareAppMessage'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })
      wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
        wx.updateAppMessageShareData({ 
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: `https://makerone.shengjian.net${key}${window.location.search}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: img ? img : 'https://makerone.shengjian.net/nft/attachmentFile/share_logo.png', // 分享图标
          success: function () {
            // message.success('分享成功')
          }
        })
        wx.updateTimelineShareData({ 
          title: title, // 分享标题
          link: `https://makerone.shengjian.net${key}${window.location.search}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: img ? img : 'https://makerone.shengjian.net/nft/attachmentFile/share_logo.png', // 分享图标
          success: function () {
            // message.success('分享成功')
          }
        })
      });
    } else {
      message.error(res.message);
    }
  })
}