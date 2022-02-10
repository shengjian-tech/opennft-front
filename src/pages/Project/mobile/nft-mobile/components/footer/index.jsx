import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { Badge, TabBar } from 'antd-mobile'
import {
  SearchOutline,
  UserOutline,
  AddCircleOutline,
  HistogramOutline,
} from 'antd-mobile-icons'
import {HomeOutlined} from '@ant-design/icons';
import { preRouter } from 'src/commons/PRE_ROUTER';
import './style.less';

const tabs = [
  {
    key: '/nft_mobile_home',
    title: '首页',
    icon: <HomeOutlined />,
  },
  {
    key: '/nft_mobile_list',
    title: '排行榜',
    icon: <HistogramOutline />,
  },
  {
    key: '/nft_mobile_market',
    title: 'NFT市场',
    icon:<SearchOutline />,
  },
  // {
  //   key: '/nft_mobile_create',
  //   title: '创建',
  //   icon: <AddCircleOutline />,
  // },
  {
    key: '/nft_mobile_myself',
    title: '我的',
    icon: <UserOutline />,
  },
]

export default class Footer extends Component {
  state = {
    loading: false,
    activeKey:null,
  };

  componentDidMount() {
    if(this.props.history.location.pathname.replace(preRouter,'') === '/nft_mobile_creatNft' 
    || this.props.history.location.pathname.replace(preRouter,'') === '/nft_mobile_creatCollection'){
      this.setState({activeKey:'/nft_mobile_create'})
    }else{
      this.setState({activeKey:this.props.history.location.pathname.replace(preRouter,'')})
    }
  }
  setRouteActive = (value) =>{
    this.props.history.push(`${preRouter}${value}`)
    this.setState({activeKey:value})
  }
  render() {
    const { activeKey } = this.state
    return (
      <TabBar activeKey={activeKey} onChange={this.setRouteActive}>
        {tabs.map(item => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} badge={item.badge}/>
        ))}
      </TabBar>
    );
  }
}