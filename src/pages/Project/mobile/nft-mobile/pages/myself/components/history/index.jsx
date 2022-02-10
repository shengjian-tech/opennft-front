import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { message,Row,Col,Card,Space,Button,Popconfirm } from 'antd';
import { Link } from 'react-router-dom'
import { NavBar,Divider } from 'antd-mobile'
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER';
import Footer from '../../../../components/footer'
import './style.less';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

var aaa = ''

@config({
  path: '/nft_mobile_myself_history',
  ajax: true,
  noFrame: true,
  noAuth: true,
})
export default class Myself_History extends Component {
  state = {
    loading: false,
    hisData:[],
  };

  componentDidMount() {
    this.handleHistory()
  }
  back = () =>{
    this.props.history.push(`${preRouter}/nft_mobile_myself`)
  }
  //取消支付
  getCancel(id){
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_order_cancelOrder}?orderId=${id}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        message.success(res.message)
        this.handleHistory()
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  //去支付
  getPay = (prepayId,id)=>{
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_order_getPayRequestParam}?prepayId=${prepayId}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        let param = {
          'appId':res.result.appId,
          'timeStamp': res.result.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          'nonceStr': res.result.nonceStr, // 支付签名随机串，不长于 32 位
          'package': res.result.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          'signType': res.result.signType, // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
          'paySign': res.result.paySign
        }
        // 支持回调必要方法start
        // 支持回调必要方法start
        if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', function () { this.onBridgeReady(param); }, false);
          } else if (document['attachEvent']) {
            document['attachEvent']('WeixinJSBridgeReady', function () { this.onBridgeReady(param); });
            document['attachEvent']('onWeixinJSBridgeReady', function () { this.onBridgeReady(param); });
          }
        } else {
          this.onBridgeReady(param,id);
        }
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  //微信公众号支付
  onBridgeReady(Data,id) {
    const _this = this
    window.WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      Data,
      function (res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          aaa = setInterval(() => {
            _this.getResult(id)
          }, 1000);
        } else {
          clearInterval(aaa)
        }
      }
    );
  }
  getResult(id){
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_order_checkOrderState}?orderId=${id}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({payResult:res.result})
        if(res.result){
          clearInterval(aaa)
          message.success('订单支付成功！')
          this.setState({visiblePay:false})
          this.handleHistory()
        }
      }else{
        message.error(res.message ? res.message : '失败')
      }
    }).finally(() => this.setState({ loading: false }));
  }
  //列表数据
  handleHistory(){
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_order_findTransHis}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({hisData:res.result})
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  render() {
    const { loading,hisData } = this.state
    return (
      <div styleName='list'>
        <div styleName='header'>
          <NavBar onBack={this.back}><img src={require('../../../../assets/logo.png')} alt="" /></NavBar>
        </div>
        <div styleName='details'>
          <h2>交易历史</h2>
          <div>
            {hisData?.map(item=>
              <Card style={{marginTop:'10px'}}>
                <h3>{item.assetsName}</h3>
                <Row gutter={10}>
                  <Col span={5}>
                    <img width='100%' style={{objectFit:'contain'}} src={AJAX_PREFIXCONFIG + item.dataPath} alt="" />
                  </Col>
                  <Col span={19}>
                    <p style={{overflow:'hidden',fontSize:'12px',textOverflow:'ellipsis',margin:0}}>{item.fromUserName}</p>
                    <div style={{textAlign:'center',fontWeight:600}}>↓</div>
                    <p style={{overflow:'hidden',fontSize:'12px',textOverflow:'ellipsis',margin:0}}>{item.toUserName}</p>
                  </Col>
                </Row>
                <Divider style={{margin:'5px 0'}}>更多</Divider>
                <Row>
                  <Col span={8}>
                    <div>
                      <p style={{fontSize:'12px',color:'gray',margin:0}}>共{item.num}件</p>
                      <p style={{fontSize:'12px',color:'gray',margin:0}}>gas费：￥{item.gas}</p>
                      <p style={{margin:0}}>实付款：￥{item.tradeTotal}</p>
                    </div>
                  </Col>
                  <Col span={16}>
                    {item.payState == 0 ? <Space style={{float:'right',marginTop:'10px'}}>
                      <Popconfirm title='确定删除吗？' onConfirm={() => this.getCancel(item.id)} okText="确定" cancelText="取消">
                        <Button>取消支付</Button>
                      </Popconfirm>
                      <Button type='primary' onClick={()=>this.getPay(item.prepayId,item.id)}>去支付</Button>
                    </Space> : item.payState == 1 ? <Button style={{float:'right',marginTop:'10px'}} disabled>订单已完成</Button>
                    : <Button style={{float:'right',marginTop:'10px'}} disabled>订单已取消</Button>}
                  </Col>
                </Row>
              </Card>
            )}
          </div>
        </div>
        <div styleName='footer'>
          <Footer history={this.props.history}/>
        </div>
      </div >
    );
  }
}