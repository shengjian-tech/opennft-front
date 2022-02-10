import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row,Col,Input,Menu, Dropdown, Button, Space } from 'antd'
import { preRouter } from 'src/commons/PRE_ROUTER'
import { SearchOutlined } from '@ant-design/icons';
import './style.less';


export default class Footer extends Component {
  state = {

  };

  componentDidMount() {

  }

  render() {

    return (
      <div styleName="footer">
        <Row styleName='floorOne'>
          <Col span={12}>
            <div styleName='logo'>
              <img src={require('../../assets/logo.png')} alt />
            </div>
          </Col>
          <Col span={4}></Col>
          <Col span={8}>
            <div styleName='partner'>
              <Row>
                <Col span={2}>
                  <img src={require('../../assets/phone.svg')} alt />
                </Col>
                <Col span={2}>
                  <img src={require('../../assets/address.png')} alt />
                </Col>
                <Col span={2}>
                  <img src={require('../../assets/vx.png')} alt />
                </Col>
                <Col span={2}>
                  <img src={require('../../assets/qq.png')} alt />
                </Col>
                <Col span={2}>
                  <img src={require('../../assets/wb.png')} alt />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row styleName='floorTwo'>
          <Col span={12}>
            Copyright @2021 XXXXX
          </Col>
          <Col span={6}></Col>
          <Col>
            服务条款
          </Col>
        </Row>
      </div>
    );
  }
}