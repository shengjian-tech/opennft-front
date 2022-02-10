import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { Link } from 'react-router-dom'
import { toLogin,locationHref} from 'src/commons'
import { message,Space,Button} from 'antd';
import { List,Modal } from 'antd-mobile'
import { AppOutline,AddCircleOutline,AppstoreOutline,LinkOutline,StarOutline,KeyOutline,UserContactOutline } from 'antd-mobile-icons'
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER';
import Footer from '../../components/footer'
import './style.less';
import { getJSSDK } from 'src/commons/share';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

getJSSDK('MakerOne 个人中心','涉及到个人的数据信息，快来完善自己的信息然后挑选自己喜欢的作品吧',null)

@config({
  path: '/nft_mobile_myself',
  ajax: true,
  noFrame: true,
  noAuth: true,
})
export default class Myself extends Component {
  state = {
    loading: false,
    collData:[],
    creatData:[],
    otherData:[],
    hisData:[],
    userData:null,
    visibleInfo:false,
    columns:[
      {
        title: '事件', dataIndex: 'payState', key: 'payState',
        render: (value, record) => {
            const { payState } = record;
            return (
              <div style={{whiteSpace:'nowrap',textOverflow:'ellipsis'}}>
                {/* {text === '转移' ? <span><img alt="example" src={require('../../assets/out.png')} />&nbsp;&nbsp;转移</span>
                : <span><img alt="example" src={require('../../assets/sell.png')} />&nbsp;&nbsp;售卖</span>} */}
                {payState == 0 ? '未支付' : payState == 1 ? '已支付' : '已取消'}
              </div>
            )
        },
      },
      {
        title: '价格', dataIndex: 'a', key: 'a',
      },
      {
        title: '从', dataIndex: 'fromUserName', key: 'fromUserName',
      },
      {
        title: '到', dataIndex: 'toUserName', key: 'toUserName',
      },
      {
        title: '日期', dataIndex: 'createTime', key: 'createTime',
      },
    ],
  };

  componentDidMount() {
    if(sessionStorage.getItem('ifInfo')=='true'){
      this.handleUser()
    }else{
      message.warning('您的资料还未补充完善哦')
    }
  }
  //用户个人信息
  handleUser(){
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_userassets_findUserDetails}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({userData:res.result})
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }

  // leveOut = () =>{
  //   this.props.ajax.post('api/system/logout').finally(() => toLogin());
  // }
  render() {
    const { loading,userData,visibleInfo } = this.state
    return (
      <div styleName='myself'>
        <div styleName='header'>
          <img src={require('../../assets/logo.png')} alt="" />
        </div>
        <div styleName='banner'>
          <img alt="example" src={require('../../assets/selfBanner.png')} />
        </div>
        {/* <div styleName='people'>
          {userData && userData.avatarPath ? <img alt="example" src={AJAX_PREFIXCONFIG + userData.avatarPath} />
          :<img alt="example" src={require('../../assets/wechat.png')} />}
        </div>                                                                                                                                               */}
        <div styleName='content'>
          {
            userData ? <div>
              <h2>{userData?.userName}</h2>
              <p styleName='author'>address：{userData?.address}</p>
              <p styleName='author'>EVMAddress：{userData?.EVMAddress}</p>
              <p styleName='date'>{userData?.joinDate}加入</p>
            </div> : <div style={{textAlign:'center',marginTop:'10px'}}>
              <Link to={`${preRouter}/nft_mobile_myself_info`}>
                <Button style={{borderRadius:'20px'}} type='primary'>去完善资料</Button>
              </Link>
            </div>
          }
          <p style={{textAlign:'center'}}><Button type='primary' onClick={()=>{localStorage.clear();locationHref(`${preRouter}/nft_mobile_home`);}}>清除缓存</Button></p>
        </div>
        <div styleName='similar'>
          <List>
            <List.Item prefix={<AppOutline />} onClick={() => {sessionStorage.getItem('ifInfo')=='false' ? this.setState({visibleInfo:true}) 
              : locationHref(`${preRouter}/nft_mobile_myself_collection`)}}>
              收藏品{userData?.assetsCount}
            </List.Item>
            <List.Item prefix={<AddCircleOutline />} onClick={() => {sessionStorage.getItem('ifInfo')=='false' ? this.setState({visibleInfo:true}) 
              : locationHref(`${preRouter}/nft_mobile_myself_created`)}}>
              创建的{userData?.createCount}
            </List.Item>
            <List.Item prefix={<AppstoreOutline />} onClick={() => {sessionStorage.getItem('ifInfo')=='false' ? this.setState({visibleInfo:true})
              : locationHref(`${preRouter}/nft_mobile_myself_myCollection`)}}>
              我的合集{userData?.collectionCount}
            </List.Item>
            <List.Item prefix={<LinkOutline />} onClick={() => {sessionStorage.getItem('ifInfo')=='false' ? this.setState({visibleInfo:true})
              : locationHref(`${preRouter}/nft_mobile_myself_history`)}}>
              交易历史{userData?.transCount}
            </List.Item>
            {/* <List.Item prefix={<StarOutline />} onClick={() => {sessionStorage.getItem('ifInfo')=='false' ? this.setState({visibleInfo:true}) 
              : locationHref(`${preRouter}/nft_mobile_myself_focusOn`)}}>
              关注{userData?.likeCount}
            </List.Item> */}
            <List.Item prefix={<KeyOutline />} onClick={() => {sessionStorage.getItem('ifInfo')=='false' ? this.setState({visibleInfo:true})
              : locationHref(`${preRouter}/nft_mobile_myself_privacy`)}}>
              隐私
            </List.Item>
            <List.Item prefix={<UserContactOutline />} onClick={() => {locationHref(`${preRouter}/nft_mobile_myself_info`)}}>
              个人中心
            </List.Item>
          </List>
        </div>
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
        <div styleName='footer'>
          <Footer history={this.props.history}/>
        </div>
      </div >
    );
  }
}