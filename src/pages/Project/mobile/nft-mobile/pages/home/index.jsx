import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { message,Row,Col,Avatar,Card } from 'antd';
import { Button } from 'antd-mobile'
import { setLoginUser } from 'src/commons';
import { Link } from 'react-router-dom';
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER';
import Footer from '../../components/footer'
import './style.less';
import 'braft-editor/dist/output.css'
import { getJSSDK } from 'src/commons/share';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

getJSSDK('MakerOne NFT首页','热门合集，市场合集等精彩内容都在这里哦',null)

@config({
  path: '/nft_mobile_home',
  ajax: true,
  noFrame: true,
  noAuth: true,
})
export default class Home extends Component {
  state = {
    loading: false,
    hotData:[],
  };
  componentDidMount() { 
    this.handleHot()
  }
  
  handleHot(){
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_collection_findFairCollectionList}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({hotData:res.result})
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  render() {
    const { hotData } = this.state
    return (
      <div styleName='home'>
        <div styleName='header'>
          <img src={require('../../assets/logo.png')} alt="" />
        </div>
        <div styleName='banner'>
          <img src={require('../../assets/homeBanner.png')} alt="" />
        </div>
        <div styleName='hot_collection'>
          <h2>热门合集</h2>
          <Row gutter={10}>
            {hotData?.map(item=>
                <Col span={12}>
                  <Link to={`${preRouter}/nft_mobile_collection?collectionId=${item.collectionId}`}>
                    <Card
                      styleName='card'
                      hoverable
                      cover={<img style={{width:'100%',objectFit:'contain'}} alt="example" src={AJAX_PREFIXCONFIG + item.coverPath} />}
                      >
                      <Avatar styleName='img' alt="example" src={AJAX_PREFIXCONFIG + item.logoPath} />
                      <h3>{item.name}</h3>
                      <p>作者<span style={{color:'#2345A7'}}>{item.authorName}</span></p>
                      {item.details ? <div className="braft-output-content" dangerouslySetInnerHTML = {{ __html:decodeURIComponent(item.details) }}></div>
                      : <div>暂无简介</div>}
                    </Card>
                  </Link>
                </Col>
              )}
          </Row>
        </div>
        {/* <div styleName='market'>
          <h2>NFT市场</h2>
          <Link to={`${preRouter}/nft_mobile_market`}>
            <div>
              <p>艺术、音乐、域名、虚拟世界、收藏品、运动</p>
            </div>
          </Link>
        </div> */}
        <div styleName='creat_sales'>
          <h2>创建和销售您的NFTs</h2>
          <Row gutter={20}>
            <Col span={6}>
              <div styleName='desc'>
                <img src={require('../../assets/home1.png')} alt="" />
                <h3>注册登录</h3>
              </div>
            </Col>
            <Col span={18}>
              <p>微信直接登录，方便用户使用体验</p>
            </Col>
          </Row>
          <br />
          <Row gutter={20}>
            <Col span={6}>
              <div styleName='desc'>
                <img src={require('../../assets/home2.png')} alt="" />
                <h3>创建合集</h3>
              </div>
            </Col>
            <Col span={18}>
              <p>添加社交链接、描述、个人资料和横幅图片，并设置版费。</p>
            </Col>
          </Row>
          <br />
          <Row gutter={20}>
            <Col span={6}>
              <div styleName='desc'>
                <img src={require('../../assets/home3.png')} alt="" />
                <h3>添加NFT</h3>
              </div>
            </Col>
            <Col span={18}>
              <p>上传您的作品（图像、视频、音频或 3D 艺术作品），添加标题和描述，并使用属性、统计数据和可解锁内容自定义您的 NFT。</p>
            </Col>
          </Row>
          <br />
          <Row gutter={20}>
            <Col span={6}>
              <div styleName='desc'>
                <img src={require('../../assets/home4.png')} alt="" />
                <h3>上架销售</h3>
              </div>
            </Col>
            <Col span={18}>
              <p>在拍卖、固定价格列表和降价列表之间进行选择。您选择出售 NFT 的方式，我们帮助您出售它们！</p>
            </Col>
          </Row>
          <br />
        </div>
        <div styleName='footer'>
          <Footer history={this.props.history}/>
        </div>
      </div >
    );
  }
}
