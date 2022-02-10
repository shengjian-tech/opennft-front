import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { message,Row,Col,Card,Avatar } from 'antd';
import { Link } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER';
import Footer from '../../../../components/footer'
import './style.less';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
  path: '/nft_mobile_myself_myCollection',
  ajax: true,
  noFrame: true,
  noAuth: true,
})
export default class Myself_myCollection extends Component {
  state = {
    loading: false,
    collData:[],
  };

  componentDidMount() {
    this.handleOther()
  }
  back = () =>{
    this.props.history.push(`${preRouter}/nft_mobile_myself`)
  }
  //列表数据
  handleOther(){
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_userassets_findUserCollection}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({otherData:res.result})
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  back = () =>{
    this.props.history.push(`${preRouter}/nft_mobile_myself`)
  }
  render() {
    const { loading,otherData } = this.state
    return (
      <div styleName='list'>
        <div styleName='header'>
          <NavBar onBack={this.back}><img src={require('../../../../assets/logo.png')} alt="" /></NavBar>
        </div>
        <div styleName='details'>
          <h2>我的合集</h2>
          <Row gutter={30}>
          {otherData?.map(item=>
                <Col span={12}>
                  <Link to={`${preRouter}/nft_mobile_collection?collectionId=${item.id}`}>
                  <Card
                    styleName='cards'
                    hoverable
                    cover={<img style={{width:'100%',objectFit:'contain'}} alt="example"src={AJAX_PREFIXCONFIG + item.coverPath} />}
                    >
                    <Avatar styleName='img' alt="example" src={AJAX_PREFIXCONFIG + item.logoPath} />
                    <h3>{item.name}</h3>
                    <p>作者<span style={{color:'#2345A7'}}>{item.authorName}</span></p>
                    <p>{item.details}</p>
                  </Card>
                  </Link>
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