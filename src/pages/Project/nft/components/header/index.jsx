import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import config from 'src/commons/config-hoc';
import { Row,Col,Input,Menu, Dropdown, Button, Space } from 'antd'
import { preRouter } from 'src/commons/PRE_ROUTER'
import { toLogin} from 'src/commons';
import { SearchOutlined,DownOutlined } from '@ant-design/icons';
import './style.less';

@config({
  ajax: true,
})

export default class Header extends Component {
  state = {

  };

  componentDidMount() {

  }
  leveOut = () =>{
    this.props.ajax.post('api/system/logout').finally(() => toLogin());
  }
  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <a rel="noopener noreferrer" href={`${preRouter}/nft_creatNFT`}>
            创建NFT
          </a>
        </Menu.Item>
        <Menu.Item>
          <a rel="noopener noreferrer" href={`${preRouter}/nft_creatCollection`}>
            创建合集
          </a>
        </Menu.Item>
      </Menu>
    )
    const menu1 = (
      <Menu>
        <Menu.Item>
          <a rel="noopener noreferrer" href={`${preRouter}/nft_myself`}>
            个人中心
          </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.leveOut}>退出
          </a>
        </Menu.Item>
      </Menu>
    )
    return (
      <div styleName="header">
        <Row>
          <Col span={5}>
            <div styleName='logo'>
              <Link to={`${preRouter}/nft_home`}><img src={require('../../assets/logo.png')} alt /></Link>
            </div>
          </Col>
          <Col span={7}>
            <div styleName='search'>
              <Input placeholder='搜索收藏品，合集，以及账户' prefix={<SearchOutlined />}></Input>
            </div>
          </Col>
          <Col span={6}></Col>
          <Col span={6}>
            <Row>
              <Col span={16}>
                <div styleName='menu'>
                  <Row>
                    <Col span={8}>
                      <Link to={`${preRouter}/nft_market`} style={{color:'#fff'}}>市场</Link>
                    </Col>
                    <Col span={8}>
                      <Link to={`${preRouter}/nft_list`} style={{color:'#fff'}}>排行榜</Link>
                    </Col>
                    <Col span={8}>
                      <Dropdown overlay={menu} placement="bottomCenter">
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{color:'#fff'}}>
                          创建&nbsp;<DownOutlined />
                        </a>
                      </Dropdown>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col span={8}>
                <div styleName='user'>
                  <Row>
                    <Col span={12}>
                      <Link to={`${preRouter}/nft_detail`} style={{color:'#fff'}}>图一</Link>
                    </Col>
                    <Col span={12}>
                      <Dropdown overlay={menu1} placement="bottomCenter">
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{color:'#fff'}}>
                          {JSON.parse(sessionStorage.getItem('login-user')).name}&nbsp;<DownOutlined />
                        </a>
                      </Dropdown>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}