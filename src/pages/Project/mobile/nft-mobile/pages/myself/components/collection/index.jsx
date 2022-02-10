import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { message,Row,Col,Card,Button,Modal,Space } from 'antd';
import { Link } from 'react-router-dom'
import { NavBar,InfiniteScroll } from 'antd-mobile'
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER';
import Footer from '../../../../components/footer'
import GoFrom from './goFrom'
import './style.less';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
  path: '/nft_mobile_myself_collection',
  ajax: true,
  noFrame: true,
  noAuth: true,
})
export default class Myself_collection extends Component {
  state = {
    loading: false,
    collData:[],
    pageNo:0,
    pageSize:6,
    hasMore:true,
    fromStatus:false,
    visibleFrom:false,
    visibleStatus:false,
    assetsId:null,
  };

  componentDidMount() {
    // this.handleCollection()
  }
  
  loadMore = async() =>{
    const { collData, pageNo,pageSize } = this.state;
    const append = await this.handleCollection(pageNo+1,pageSize);
    const addList = [...collData, ...append.appendList];
    
    this.setState({
      collData: addList,
      hasMore: addList.length < append.total,
    });
  }
  //列表数据
  handleCollection(pageNo,pageSize){
    this.setState({loading:true})
    const params = {
      pageNo:pageNo,
      pageSize:pageSize
    }
    return this.props.ajax.post(`${CODEMAP.nft_mobile_userassets_findUserCollectionWorks}`,params).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({pageNo:res.page.pageNo})
        return {appendList:res.result,total:res.page.totalCount}
      }
    })
  }
  //转移
  goFrom = () =>{
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_userchainplat_checkBindPrivateAndPasswd}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        if(res.result){
          this.setState({visibleFrom:true})
        }else{
          // message.warning('请先绑定')
          this.setState({visibleStatus:true})
        }
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  back = () =>{
    this.props.history.push(`${preRouter}/nft_mobile_myself`)
  }
  render() {
    const { loading,collData,hasMore,visibleFrom,assetsId,visibleStatus } = this.state
    return (
      <div styleName='list'>
        <div styleName='header'>
          <NavBar onBack={this.back}><img src={require('../../../../assets/logo.png')} alt="" /></NavBar>
        </div>
        <div styleName='details'>
          <h2>收藏品</h2>
          <Row gutter={30}>
              {collData?.map(item=>
                <Col span={12}>
                  <Card
                    styleName='card'
                    hoverable
                    cover={<Link to={`${preRouter}/nft_mobile_nftDetails?worksId=${item.worksId}`}>
                    <img style={{width:'100%',objectFit:'contain'}} alt="example" src={AJAX_PREFIXCONFIG + item.dataPath} />
                    </Link>}
                    >
                    <Row>
                      <Col span={16}>
                        <p>{item.name}</p>
                        <h3>{item.id}</h3>
                        <p>冷却期:{item.day}天</p>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3>{item.price}</h3>
                        {item.day === 0 ? <Button style={{marginLeft:'-5px'}} type='primary' size="small" onClick={()=>{this.setState({assetsId:item.worksId});this.goFrom()}}>转移</Button> 
                        : <Button type='primary' size="small" disabled>转移</Button>}
                      </Col>
                    </Row>
                  </Card>
                </Col>
              )}
            </Row>
            <InfiniteScroll loadMore={this.loadMore} hasMore={hasMore} />
        </div>
        <GoFrom
          visible={visibleFrom}
          assetsId={assetsId}
          onOk={() => {this.setState({visibleFrom:false});this.handleCollection(1,6)}}
          onCancel={() => this.setState({visibleFrom:false})}
        />
        <Modal
        visible={visibleStatus}
        content={
          <div style={{textAlign:'center'}}>
            <h4>您当前未绑定开放网络</h4>
            <Space>
              <Button style={{borderRadius:'20px'}} onClick={()=>this.setState({visibleStatus:false})}>取消</Button>
              <Link to={`${preRouter}/nft_mobile_myself_privacy`}>
                <Button style={{borderRadius:'20px'}} type='primary'>去绑定</Button>
              </Link>
            </Space>
          </div>
        }
        closeOnAction
        />
        <div styleName='footer'>
          <Footer history={this.props.history}/>
        </div>
      </div >
    );
  }
}