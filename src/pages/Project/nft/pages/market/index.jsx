import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row,Col,Tabs,Card,message,Avatar,Button } from 'antd'
import config from 'src/commons/config-hoc';
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER'
import Header from '../../components/header'
import Footer from '../../components/footer'
import './style.less';
import 'braft-editor/dist/output.css'

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
  path: '/nft_market',
  ajax: true,
  noFrame: true,
  noAuth: true,
})

export default class nft_detail extends Component {
  state = {
    loading:false,
    data:[],
    marketData:[]
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

  callback(key){
    console.log(key)
  }
  getColl(id){
    localStorage.setItem('collectionId',id)
  }
  render() {
    const { data,marketData } = this.state
    const { TabPane } = Tabs;
    return (
      <div styleName="collection">
        <div styleName='nav'>
          <Header />
        </div>
        <div styleName='content'>
          <h2>NFT市场</h2>
        </div>
        <div styleName='similar'>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab='艺术' key="1">
            <Row gutter={30}>
            {marketData?.map(item=>
                <Col span={12}>
                  <Card
                    styleName='card'
                    hoverable
                    cover={<Link to={`${preRouter}/nft_collection`} onClick={()=>this.getColl(item.collectionId)}>
                      <img style={{width:'100%',objectFit:'contain'}} alt="" src={AJAX_PREFIXCONFIG + item.coverPath} /></Link>}>
                      <Avatar styleName='img' alt="example" src={AJAX_PREFIXCONFIG + item.logoPath} />
                      <h3>{item.name}</h3>
                      <p>作者<span style={{color:'#2345A7'}}>{item.authorName}</span></p>
                      {item.details ? <div className="braft-output-content" dangerouslySetInnerHTML = {{ __html:decodeURIComponent(item.details) }}></div>
                      : <div>暂无简介</div>}
                    
                    {item.state === 0 && item.userId === item.authorId ? 
                    <Link to={{pathname:`${preRouter}/nft_creatCollection`,state:{collectionId:item.collectionId}}}>
                      <Button style={{width:'50%',height:'30px',borderRadius:'20px'}} type='primary'>修改</Button>
                    </Link>
                    : item.state === 1 && item.userId === item.authorId ? <Button disabled>已上架</Button>
                    : item.state === 2 && item.userId === item.authorId ? <Button disabled>已售停</Button>
                    : item.state === 3 && item.userId === item.authorId ? <Button disabled>已下架</Button>
                    : item.state === 4 && item.userId === item.authorId ? <Button disabled>已删除</Button>
                    : <Button disabled>无修改权限</Button>}
                  </Card>
                </Col>
              )}
            </Row>
          </TabPane>
          <TabPane tab='音乐' key="2">
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
          </TabPane>
        </Tabs>
        </div>
        <div styleName='footer'>
          <Footer />
        </div>
      </div>
    )
  }
}