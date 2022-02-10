import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { message,Tabs,Row,Col,Card,Avatar} from 'antd';
import { Link } from 'react-router-dom';
import { Button,NavBar } from 'antd-mobile'
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER';
import Footer from '../../components/footer'
import './style.less';
import 'braft-editor/dist/output.css'
import { getJSSDK } from 'src/commons/share';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

getJSSDK('MakerOne 合集市场','这里有最全最新的合集作品，你可以尽情搜索你需要的合集作品，还不快来试试看？',null)

@config({
  path: '/nft_mobile_market',
  ajax: true,
  noFrame: true,
  noAuth: true,
})
export default class Market extends Component {
  state = {
    loading: false,
    marketData:[],
  };

  componentDidMount() {
    this.handleMarket()
  }
  handleMarket(){
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_collection_findNftMarketList}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({marketData:res.result})
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  back = () =>{
    this.props.history.push(`${preRouter}/nft_mobile_home`)
  }
  render() {
    const { loading,marketData} = this.state
    const { TabPane } = Tabs;
    return (
      <div styleName='list'>
        <div styleName='header'>
          <NavBar onBack={this.back}><img src={require('../../assets/logo.png')} alt="" /></NavBar>
        </div>
        <div styleName='content'>
          <h2>NFT市场</h2>
        </div>
        <div styleName='similar'>
        {/* <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab='艺术' key="1">
            
          </TabPane> */}
          <Row gutter={10}>
              {marketData?.map(item=>
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
          {/* <TabPane tab='音乐' key="2">
            暂无内容
          </TabPane>
          <TabPane tab='域名' key="3">
            暂无内容
          </TabPane>
          <TabPane tab='虚拟世界' key="4">
            暂无内容
          </TabPane>
          <TabPane tab='收藏品' key="5">
            暂无内容
          </TabPane>
          <TabPane tab='运动' key="6">
            暂无内容
          </TabPane> */}
        {/* </Tabs> */}
        </div>
        <div styleName='footer'>
          <Footer history={this.props.history}/>
        </div>
      </div >
    );
  }
}