import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { message,Row,Col,Card } from 'antd';
import { Link } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER';
import Footer from '../../../../components/footer'
import './style.less';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
  path: '/nft_mobile_myself_created',
  ajax: true,
  noFrame: true,
  noAuth: true,
})
export default class Myself_created extends Component {
  state = {
    loading: false,
    creatData:[],
  };

  componentDidMount() {
    this.handleCreat()
  }

  //列表数据
  handleCreat(){
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_userassets_findMyCreateWorks}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({creatData:res.result})
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  back = () =>{
    this.props.history.push(`${preRouter}/nft_mobile_myself`)
  }
  render() {
    const { loading,creatData } = this.state
    return (
      <div styleName='list'>
        <div styleName='header'>
          <NavBar onBack={this.back}><img src={require('../../../../assets/logo.png')} alt="" /></NavBar>
        </div>
        <div styleName='details'>
          <h2>创建的</h2>
          <Row gutter={30}>
              {creatData?.map(item=>
                <Col span={12}>
                  <Card
                    styleName='card'
                    hoverable
                    cover={<img style={{width:'100%',objectFit:'contain'}} alt="example" src={AJAX_PREFIXCONFIG + item.dataPath} />}
                    >
                    <Row>
                      <Col span={16}>
                        <p>{item.name}</p>
                        <h3>{item.id}</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3>{item.price}</h3>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              )}
            </Row>
        </div>
        <div styleName='footer'>
          <Footer history={this.props.history}/>
        </div>
      </div >
    );
  }
}