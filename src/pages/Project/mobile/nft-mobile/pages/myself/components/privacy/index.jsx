import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { message,Button,Space,Card,Popconfirm,Modal,Form } from 'antd';
import { Link } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER';
import Footer from '../../../../components/footer'
import Down from './components/down'
import Del from './components/del'
import Bind from './components/bind'
import './style.less';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
  path: '/nft_mobile_myself_privacy',
  ajax: true,
  noFrame: true,
  noAuth: true,
})
export default class Myself_History extends Component {
  state = {
    loading: false,
    chainData:[],
    visibleDown:false,
    visibleDel:false,
    visibleBind:false,
    checkState:false,
  };

  componentDidMount() {
    this.handleChain()
    this.handleCheck()
  }
  back = () =>{
    this.props.history.push(`${preRouter}/nft_mobile_myself`)
  }
  
  //列表数据
  handleChain(){
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_userchainplat_findUserChainplat}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({chainData:res.result})
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  handleCheck(){
    this.props.ajax.post(`${CODEMAP.nft_mobile_userchainplat_checkBindChainOpenNet}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({checkState:res.result})
      } else {
        message.error(res.message);
      }
    })
  }
  render() {
    const { loading,chainData,visibleDown,visibleDel,visibleBind,checkState} = this.state
    return (
      <div styleName='privacy'>
        <div styleName='header'>
          <NavBar onBack={this.back}><img src={require('../../../../assets/logo.png')} alt="" /></NavBar>
        </div>
        <div styleName='details'>
          <h2>隐私</h2>
          {chainData?.map((item,index)=>
            <Card>
              <div>
                <p>链平台名称：<br />{item.chainPlatName}</p>
                <p>链账户地址：<br />{item.address}</p>
                {/* <p>私钥路径：{item.privatePath}</p> */}
                {/* <p>助记词：{item.mnemonic}</p> */}
                {/* <p>最近链接时间：{item.prevTime}</p> */}
                <Space>
                  <Button type='primary' onClick={()=>this.setState({visibleDown:true})}>下载公钥私钥</Button>
                  <Button type='danger' onClick={()=>this.setState({visibleDel:true})}>删除公钥私钥</Button>
                </Space>
                <br /><br />
                {checkState ? <Button type='primary' disabled>绑定百度超级链开放网络</Button>
                : <Button type='primary' onClick={()=>this.setState({visibleBind:true})}>绑定百度超级链开放网络</Button>}
              </div>
            </Card>
          )}
        </div>
        <Down
          visible={visibleDown}
          onOk={() => {this.setState({visibleDown:false})}}
          onCancel={() => this.setState({visibleDown:false})}
        />
        <Del
          visible={visibleDel}
          onOk={() => {this.setState({visibleDel:false});this.handleChain()}}
          onCancel={() => this.setState({visibleDel:false})}
        />
        <Bind
          visible={visibleBind}
          onOk={() => {this.setState({visibleBind:false});this.handleCheck()}}
          onCancel={() => this.setState({visibleBind:false})}
        />
        <div styleName='footer'>
          <Footer history={this.props.history}/>
        </div>
      </div >
    );
  }
}