import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { message,Table,Row,Col,Card,Button,Collapse,Space} from 'antd';
import { NavBar,Dialog,Result,Modal,InfiniteScroll } from 'antd-mobile'
import { DownOutlined } from '@ant-design/icons';
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER';
import Footer from '../../components/footer'
import Shelves from './components/Shelves'
import { Link } from 'react-router-dom'
import ReactJson from 'react-json-view'
import './style.less';
import 'braft-editor/dist/output.css'
import { getJSSDK } from 'src/commons/share';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

var aaa = ''
function geturl(name) {
  var reg = new RegExp('[^\?&]?' + encodeURI(name) + '=[^&]+')
  var arr = window.location.search.match(reg)
  if (arr != null) {
    return decodeURI(arr[0].substring(arr[0].search('=') + 1))
  }
  return ''
}

@config({
  path: '/nft_mobile_nftDetails',
  ajax: true,
  noFrame: true,
  noAuth: true,
})
export default class NftDetails extends Component {
  state = {
    loading: false,
    avaData:null,
    userData:null,
    visible:false,
    visiblePay:false,
    visibleSuccess:false,
    prepayId:null,
    payResult:false,
    payData:null,
    visibleInfo:false,
    visibleStatus:false,
    visibleBuyer:false,
    buyerData:[],
    pageNo:0,
    pageSize:3,
    hasMore:true,
    day:0,
  };

  componentDidMount() {
    this.handleAvatar()
    this.handleUser()
    this.handleDay()
  }
  //获取头像数据
  handleAvatar(){
    const worksId = geturl('worksId')
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_works_buyWorksInfo}?worksId=${worksId}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({avaData:res.result})
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  //获取冷却天数
  handleDay(){
    this.props.ajax.post(`${CODEMAP.nft_works_getCoolingPeriod}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({day:res.result})
      } else {
        message.error(res.message);
      }
    })
  }
  //获取持有数据
  handleUser(){
    const worksId = geturl('worksId')
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_works_buyWorks}?worksId=${worksId}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({userData:res.result})
        getJSSDK(`MakerOne NFT作品--${res.result.worksName}`,'包含特定合集下所有精彩作品，更多内容请点击查看，实名认证后还可以进行更多操作哦',null)
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  getOrder = () =>{
    if(sessionStorage.getItem('ifInfo') == 'false'){
      this.setState({visibleInfo:true})
    }else{
      const { userData } = this.state
      var worksId = geturl('worksId')
      const params = {
        worksId:worksId,
        sellerId:userData.authorId,
        num:1,
        tradeType:5
      }
      this.props.ajax.post(`${CODEMAP.nft_mobile_order_checkUnpaidOrders}`).then(res => {
        if (res.status == 'success' && res.statusCode == '200') {
          if(res.result){
            this.setState({visibleStatus:true})
          }else{
            this.setState({loading:true})
            this.props.ajax.post(`${CODEMAP.nft_mobile_order_generateOrderByWorksId}`,params).then(res => {
              if (res.status == 'success' && res.statusCode == '200') {
                message.success(res.message ? res.message : '成功')
                this.setState({visiblePay:true,prepayId:res.result.prepayId,payData:res.result})
              }else{
                message.error(res.message ? res.message : '失败')
              }
            }).finally(() => this.setState({ loading: false }));
          }
        } else {
          message.error(res.message);
        }
      })  
    }
  }
  getPay = ()=>{
    const { prepayId } = this.state
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
          this.onBridgeReady(param);
        }
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  
  //微信公众号支付
  onBridgeReady(Data) {
    const _this = this
    const { payResult } = _this.state
    window.WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      Data,
      function (res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          aaa = setInterval(() => {
            _this.getResult()
          }, 1000);
        } else {
          clearInterval(aaa)
        }
      }
    );
  }
  getResult(){
    const { payData } = this.state
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_order_checkOrderState}?orderId=${payData.id}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({payResult:res.result})
        if(res.result){
          clearInterval(aaa)
          message.success('订单支付成功！')
          this.setState({visiblePay:false})
          this.handleAvatar()
          this.handleUser()
          this.props.history.push(`${preRouter}/nft_mobile_myself_collection`)
        }
      }else{
        message.error(res.message ? res.message : '失败')
      }
    }).finally(() => this.setState({ loading: false }));
  }
  loadMore = async() =>{
    const { buyerData, pageNo,pageSize } = this.state;
    const append = await this.getBuyer(pageNo+1,pageSize);
    const addList = [...buyerData, ...append.appendList];
    this.setState({
      buyerData: addList,
      hasMore: addList.length < append.total,
    });
  }
  getBuyer = (pageNo,pageSize) =>{
    
    const worksId = geturl('worksId')
    const params = {
      pageNo:pageNo,
      pageSize:pageSize
    }
    return this.props.ajax.post(`${CODEMAP.nft_mobile_works_findWorkBuyers}?worksId=${worksId}`,params).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        // this.setState({buyerData:res.result})
        return {appendList:res.result,total:res.page.totalCount}
      }
    })
  }
  back = () =>{
    if(geturl('collectionId')){
      this.props.history.push(`${preRouter}/nft_mobile_collection?collectionId=${geturl('collectionId')}`)
    }else{
      this.props.history.push(`${preRouter}/nft_mobile_myself`)
    }
  }
  render() {
    const { loading,avaData,userData,visible,visibleSuccess,visiblePay,payData,visibleInfo,
      visibleStatus,visibleBuyer,buyerData,hasMore,day } = this.state
    const { Panel } = Collapse;
    return (
      <div styleName='nftDetails'>
        <div styleName='header'>
        <NavBar onBack={this.back}><img src={require('../../assets/logo.png')} alt="" /></NavBar>
        </div>
        <div styleName='content'>
          <Row>
            <Col span={16}>
              <img style={{width:'100%',objectFit:'contain'}} src={AJAX_PREFIXCONFIG + userData?.logoPath} alt="" />
            </Col>
          </Row>
          <h3>{userData?.worksName}</h3>
          <h2>#{userData?.worksNum}</h2>
          {/* <p>购买者<Button type='link' onClick={()=>{this.setState({visibleBuyer:true,buyerData:[],hasMore:true})}}>点击查看</Button></p> */}
          <p>商品转移冷却期：{day}天</p>
          <Card>
            <div styleName='price'>
            <h3>发行总量：{userData?.totalNumber}</h3>
            <h3>剩余数量：{userData?.remainingNum}</h3>
            <p>目前价格</p>
            <h2>&nbsp;￥{userData?.price}</h2>
              {userData?.state == 0 && userData?.authorId == userData?.userId ? <Button type='primary' disabled onClick={()=>this.setState({visible:true})}>上架</Button>
              : userData?.state == 0 && userData?.authorId != userData?.userId ? <Button type='primary' disabled>未上架</Button>
              : userData?.state == 1 && userData?.authorId == userData?.userId ? <Button type='primary' disabled>下架</Button>
              : userData?.state == 1 && userData?.authorId != userData?.userId ? <Button type='primary' onClick={this.getOrder}>购买</Button>
              : userData?.state == 2 && userData?.authorId == userData?.userId ? <Button type='primary' disabled>售停</Button>
              : userData?.state == 2 && userData?.authorId != userData?.userId ? <Button type='primary' disabled>售停</Button>
              : userData?.state == 3 && userData?.authorId == userData?.userId ? <Button type='primary' disabled>已下架</Button>
              : userData?.state == 3 && userData?.authorId != userData?.userId ? <Button type='primary' disabled>已下架</Button>
              : userData?.state == 4 && userData?.authorId == userData?.userId ? <Button type='primary' disabled>已删除</Button>
              : userData?.state == 4 && userData?.authorId != userData?.userId ? <Button type='primary' disabled>已删除</Button>
              : <Button type='primary'></Button>}
            </div>
          </Card>
          <br />
          <Card styleName='author' title={<div>
            <img alt="example" src={require('../../assets/author.png')} />
            <span>&nbsp;&nbsp;作者</span></div>}>
            <div styleName='name'>{avaData?.author}<span>创作</span></div>
            <Collapse bordered={false} accordion>
              {/* <Panel showArrow={false} header={<p styleName='edu'><img alt="example" src={require('../../assets/detail1.png')} />&nbsp;&nbsp;特性<DownOutlined style={{float:'right',marginTop:'5px'}}/></p>} key="1">
                <div className="braft-output-content" dangerouslySetInnerHTML = {{ __html:decodeURIComponent(avaData?.detail) }}></div>
              </Panel> */}
              <Panel showArrow={false} header={<p styleName='edu'><img alt="example" src={require('../../assets/detail2.png')} />&nbsp;&nbsp;合集简介<DownOutlined style={{float:'right',marginTop:'5px'}}/></p>} key="2">
                <div className="braft-output-content" dangerouslySetInnerHTML = {{ __html:decodeURIComponent(avaData?.collectionDetail) }}></div>
              </Panel>
              <Panel showArrow={false} header={<p styleName='edu'><img alt="example" src={require('../../assets/detail3.png')} />&nbsp;&nbsp;链上信息<DownOutlined style={{float:'right',marginTop:'5px'}}/></p>} key="3">
                <ReactJson style={{overflow:'auto'}} collapseStringsAfterLength={10} src={avaData && avaData.chainInfo ? JSON.parse(avaData.chainInfo) : {}} theme="google"/>
              </Panel>
            </Collapse>
          </Card>
        </div>
        <div styleName='desc'>
          <h2>藏品描述</h2>
          {/* <img src={require('../../assets/desc.png')} alt="" /> */}
          <div className="braft-output-content" dangerouslySetInnerHTML = {{ __html:decodeURIComponent(avaData?.detail) }}></div>
        </div>
        <Shelves
          visible={visible}
          onOk={() => {this.setState({visible:false});this.handleUser()}}
          onCancel={() => this.setState({visible:false})}
        />
        <Modal
        visible={visibleInfo}
        content={
          <div style={{textAlign:'center'}}>
            <h4>请完善资料后进行操作</h4>
            <Space>
              <Button style={{borderRadius:'20px'}} onClick={()=>this.setState({visibleInfo:false})}>暂不完善</Button>
              <Link to={`${preRouter}/nft_mobile_myself_info`}>
                <Button style={{borderRadius:'20px'}} type='primary'>去完善资料</Button>
              </Link>
            </Space>
          </div>
        }
        closeOnAction
      />
      <Modal
        visible={visibleStatus}
        content={
          <div style={{textAlign:'center'}}>
            <h4>您当前有未支付的订单，请先处理</h4>
            <Space>
              <Button style={{borderRadius:'20px'}} onClick={()=>this.setState({visibleStatus:false})}>关闭</Button>
              <Link to={`${preRouter}/nft_mobile_myself_history`}>
                <Button style={{borderRadius:'20px'}} type='primary'>去处理</Button>
              </Link>
            </Space>
          </div>
        }
        closeOnAction
        />
        {/* <Modal
          visible={visibleBuyer}
          content={
            <div>
              <h3 style={{textAlign:'center'}}>作品购买者</h3>
              {buyerData?.map((item,index)=>
                <div>
                  <p style={{fontSize:'14px'}}>购买者{index+1}：{item}</p>
                </div>  
              )}
              <InfiniteScroll loadMore={this.loadMore} hasMore={hasMore} />
            </div>
          }
          closeOnAction
          onClose={() => {
            this.setState({visibleBuyer:false})
          }}
          actions={[
            {
              key: 'confirm',
              text: '我知道了',
            },
          ]}
        /> */}
        <Modal
          visible={visibleSuccess}
          content={
            <Result
              status='success'
              title='购买成功'
              description='当前订单已成功购买，请查看个人中心'
            />
          }
          closeOnAction
          onClose={() => {
            this.setState({visibleSuccess:false})
          }}
          actions={[
            {
              key: 'confirm',
              text: '我知道了',
            },
          ]}
        />
        <Modal
        visible={visiblePay}
        content={
          <div styleName='priceInfo'>
            <h3>当前订单信息(单位：元)</h3>
            <p>当前订单需消耗gas金额：{payData?.gas}</p>
            <p>当前购买数量为：{payData?.num}</p>
            <p>当前购买作品单价为：{payData?.price}</p>
            <p>当前订单需支付金额：{payData?.tradeTotal}</p>
            <Row gutter={10}>
              <Col span={12}>
                <Button style={{width:'80%',borderRadius:'20px'}} onClick={()=>this.setState({visiblePay:false})}>取消</Button>
              </Col>
              <Col span={12}>
                <Button style={{width:'80%',borderRadius:'20px'}} type='primary' onClick={this.getPay}>确认支付</Button>
              </Col>
            </Row>
          </div>
        }
        closeOnAction
      />
        <div styleName='footer'>
          <Footer history={this.props.history}/>
        </div>
      </div >
    );
  }
}