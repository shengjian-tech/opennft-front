import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { message,Table,Avatar} from 'antd';
import { Button } from 'antd-mobile'
import { Link } from 'react-router-dom';
import { preRouter } from 'src/commons/PRE_ROUTER';
import Footer from '../../components/footer'
import './style.less';

@config({
  path: '/nft_mobile_create',
  ajax: true,
  noFrame: true,
  noAuth: true,
})
export default class Login extends Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    
  }

  render() {
    const { loading} = this.state
    return (
      <div styleName='create'>
        <div styleName='header'>
          <img src={require('../../assets/logo.png')} alt="" />
        </div>
        <div styleName='details'>
          <h2>创建</h2>
          <div><Link to={`${preRouter}/nft_mobile_creatCollection`}>创建合集</Link></div>
          <div><Link to={`${preRouter}/nft_mobile_creatNft`}>创建NFT</Link></div>
        </div>
        <div styleName='footer'>
          <Footer history={this.props.history}/>
        </div>
      </div >
    );
  }
}