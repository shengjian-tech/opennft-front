import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { message,Row,Col,Input,Card } from 'antd';
import { Link } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons';
import { Button } from 'antd-mobile'
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER';
import Footer from '../../components/footer'
import './style.less';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
  path: '/nft_mobile_search',
  ajax: true,
  noFrame: true,
  noAuth: true,
})
export default class Search extends Component {
  state = {
    loading: false,
    searchData:[],
    searchText:null,
  };

  componentDidMount() {
    
  }
  getText=(e)=>{
    this.setState({loading:true})
    if (e.which === 13){
      this.props.ajax.post(`${CODEMAP.nft_mobile_works_searchWorks}?searchText=${e.target.value}`).then(res => {
        if (res.status == 'success' && res.statusCode == '200') {
          this.setState({searchData:res.result})
        } else {
          message.error(res.message);
        }
      }).finally(() => this.setState({ loading: false }));
    }
  }
  render() {
    const { searchData } = this.state
    return (
      <div styleName='search'>
        <div styleName='header'>
          <img src={require('../../assets/logo.png')} alt="" />
        </div>
        <div styleName='all'>
          <h2>搜索</h2>
          <Input onKeyDown={this.getText} style={{borderRadius:'20px',height:'40px'}} size="large" prefix={<UserOutlined />} placeholder='搜索收藏品，合集，以及账户'></Input>
        </div>
        <div styleName='hot_collection'>
          <h3>搜索结果</h3>
          {searchData && searchData.length>0 ? <Row gutter={30}>
            {searchData.map(item=>
              <Col span={12}>
                <Link to={`${preRouter}/nft_mobile_nftDetails?worksId=${item.id}`}>
                  <Card
                    styleName='card'
                    hoverable
                    cover={<img style={{height:'100px'}} alt="example" src={AJAX_PREFIXCONFIG + item.dataPath} />}
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
          : <div style={{textAlign:'center',fontSize:'16px',fontWeight:'600'}}>暂无相关作品</div>}
        </div>  
        <div styleName='footer'>
          <Footer history={this.props.history}/>
        </div>
      </div >
    );
  }
}
