import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { message,Tabs,Row,Col,Card} from 'antd';
import { Button,NavBar,InfiniteScroll } from 'antd-mobile'
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER';
import Footer from '../../components/footer'
import { Link } from 'react-router-dom'
import './style.less';
import 'braft-editor/dist/output.css'
import { getJSSDK } from 'src/commons/share';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;


function geturl(name) {
  var reg = new RegExp('[^\?&]?' + encodeURI(name) + '=[^&]+')
  var arr = window.location.search.match(reg)
  if (arr != null) {
    return decodeURI(arr[0].substring(arr[0].search('=') + 1))
  }
  return ''
}

@config({
  path: '/nft_mobile_collection',
  ajax: true,
  noFrame: true,
  noAuth: true,
})
export default class Collection extends Component {
  state = {
    loading: false,
    listData:null,
    collData:[],
    pageNo:0,
    pageSize:6,
    hasMore:true,
  };

  componentDidMount() {
    this.handleCollection()
    // this.handleCollecData(pageNo,pageSize)
  }
  handleCollection(){
    const id = geturl('collectionId')
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_collection_colletionDetail}?nftCollectionId=${id}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({listData:res.result})
        getJSSDK(`MakerOne NFT作品--${res.result.name}`,'包含特定合集下所有精彩作品，更多内容请点击查看，实名认证后还可以进行更多操作哦',null)
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  loadMore = async() =>{
    const { collData, pageNo,pageSize } = this.state;
    const append = await this.handleCollecData(pageNo+1,pageSize);
    const addList = [...collData, ...append.appendList];
    
    this.setState({
      collData: addList,
      hasMore: addList.length < append.total,
    });
  }
  handleCollecData(pageNo,pageSize){
    const id = geturl('collectionId')
    const params = {
      pageNo:pageNo,
      pageSize:pageSize
    }
    return this.props.ajax.post(`${CODEMAP.nft_mobile_collection_findWorksInCollection}?collectionId=${id}`,params).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({pageNo:res.page.pageNo})
        return {appendList:res.result,total:res.page.totalCount}
      }
    })
  }

  back = () =>{
    this.props.history.push(`${preRouter}/nft_mobile_market`)
  }
  render() {
    const { TabPane } = Tabs;
    const { loading,listData,collData,hasMore} = this.state
    return (
      <div styleName='myself'>
        <div styleName='header'>
          <NavBar onBack={this.back}><img src={require('../../assets/logo.png')} alt="" /></NavBar>
        </div>
        <div styleName='banner'>
        <img alt="example" src={AJAX_PREFIXCONFIG + listData?.bannerPath} />
        </div>
        <div styleName='people'>
          <img alt="example" src={AJAX_PREFIXCONFIG + listData?.logoPath} />
        </div>
        <div styleName='content'>
          <h2>{listData?.name}</h2>
          <p styleName='author'>作者&nbsp;&nbsp;<span>{listData?.username}</span></p>
          <div styleName='desc'>
            <Row>
              <Col span={6}>
                <h3>{listData?.counts}</h3>
                <p>作品</p>
              </Col>
              <Col span={6}>
                <h3>{listData?.possessnum}</h3>
                <p>拥有者</p>
              </Col>
              <Col span={6}>
                <h3>{listData?.lowPrice}</h3>
                <p>地板价</p>
              </Col>
              <Col span={6}>
                <h3>{listData?.tradesum}</h3>
                <p>总交易额</p>
              </Col>
            </Row>
          </div>
          <div className="braft-output-content" dangerouslySetInnerHTML = {{ __html:decodeURIComponent(listData?.details) }}></div>
        </div>
        <div styleName='similar'>
          <Row gutter={30}>
            {collData.map(item=>
              <Col span={12}>
                <Link to={`${preRouter}/nft_mobile_nftDetails?collectionId=${geturl('collectionId')}&worksId=${item.id}`}>
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
                </Link>
              </Col>
            )}
          </Row>
          <InfiniteScroll loadMore={this.loadMore} hasMore={hasMore} />
        </div>
        <div styleName='footer'>
          <Footer history={this.props.history}/>
        </div>
      </div >
    );
  }
}