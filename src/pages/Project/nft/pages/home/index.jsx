import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Card, List, Avatar, message } from 'antd'
import config from 'src/commons/config-hoc';
import { preRouter, AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER'
import Header from '../../components/header'
import Footer from '../../components/footer'
import './style.less';
import 'braft-editor/dist/output.css'

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
  path: '/nft_home',
  ajax: true,
  noFrame: true,
  noAuth: true,
})

export default class nft_home extends Component {
  state = {
    data: [
      {
        title: 'CryptoPunks',
      },
      {
        title: 'CryptoPunks',
      },
      {
        title: 'CryptoPunks',
      },
      {
        title: 'CryptoPunks',
      },
      {
        title: 'CryptoPunks',
      },
    ],
    hotData: [],
  };

  componentDidMount() {
    this.handleHot()
  }
  handleHot() {
    this.setState({ loading: true })
    this.props.ajax.post(`${CODEMAP.nft_mobile_collection_findFairCollectionList}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({ hotData: res.result })
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  getColl(id){
    localStorage.setItem('collectionId',id)
  }
  render() {
    const { data, hotData } = this.state
    return (
      <div styleName="home">
        <div styleName='nav'>
          <Header />
        </div>
        <div styleName='banner'>
          <Row gutter={30}>
            <Col span={12}>
              <div styleName='content'>
                <h2>创建，查看，销售你的数字资产</h2>
                <h3>创建，查看，销售你的数字资产创建，查看，销售你的数字资产。创建，查看，销售你的数字资产</h3>
                <div styleName='button'>
                  <Button type='primary'>创建</Button>
                  <Button style={{ marginLeft: 20 }}>创建</Button>
                </div>
                <p><a href="#">创建，查看，销售你的数字资产。创建，查看，销售你的数字资产。</a></p>
              </div>
            </Col>
            <Col span={12}>
              <Card
                hoverable
                // style={{ width: '90%' }}
                cover={<img alt="example" src={require('../../assets/banner.png')} />}
              >
                <a href="#">创建，查看，销售你的数字资产。创建，查看。</a>
              </Card>
            </Col>
          </Row>
        </div>
        <div styleName='collection'>
          <h2>热门合集</h2>
          <Row gutter={30}>
            {hotData?.map(item =>
              <Col span={6}>
                <Card
                  styleName='card'
                  hoverable
                  cover={<Link to={`${preRouter}/nft_collection`} onClick={()=>this.getColl(item.collectionId)}>
                    <img style={{width:'100%',objectFit:'contain'}} alt="" src={AJAX_PREFIXCONFIG + item.coverPath} /></Link>}>
                  <Avatar styleName='img' alt="example" src={AJAX_PREFIXCONFIG + item.logoPath} />
                  <h3>{item.name}</h3>
                  <p>作者<span style={{ color: '#2345A7' }}>{item.authorName}</span></p>
                  {item.details ? <div className="braft-output-content" dangerouslySetInnerHTML={{ __html: decodeURIComponent(item.details) }}></div>
                    : <div>暂无简介</div>}
                  {item.state === 0 && item.userId === item.authorId ?
                    <Link to={{ pathname: `${preRouter}/nft_creatCollection`, state: { collectionId: item.collectionId } }}>
                      <Button style={{ width: '50%', height: '30px', borderRadius: '20px' }} type='primary'>修改</Button>
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
        </div>
        <div styleName='ranking'>
          <h2>排行榜</h2>
          <Row gutter={50}>
            <Col span={8}>
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                  <List.Item>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>{index + 1}&nbsp;&nbsp;</div>
                    <List.Item.Meta
                      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                      title={<a href="https://ant.design">{item.title}</a>}
                      description="8,969.64" />
                    <div style={{ color: 'green' }}>+162.77%</div>
                  </List.Item>
                )}
              />
            </Col>
            <Col span={8}>
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                  <List.Item>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>{index + 1}&nbsp;&nbsp;</div>
                    <List.Item.Meta
                      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                      title={<a href="https://ant.design">{item.title}</a>}
                      description="8,969.64" />
                    <div style={{ color: 'green' }}>+162.77%</div>
                  </List.Item>
                )}
              />
            </Col>
            <Col span={8}>
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                  <List.Item>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>{index + 1}&nbsp;&nbsp;</div>
                    <List.Item.Meta
                      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                      title={<a href="https://ant.design">{item.title}</a>}
                      description="8,969.64" />
                    <div style={{ color: 'green' }}>+162.77%</div>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </div>
        <div styleName='create'>
          <div styleName='createContent'>
            <h2>创建和销售您的NFTs</h2>
            <Row gutter={50} style={{ marginTop: '50px' }}>
              <Col span={6}>
                <img alt="example" src={require('../../assets/create1.png')} />
                <h3>注册钱包</h3>
                <p>注册钱包，卡视角打卡机上来看大家杀伤力就到啦看似简单啊啊盛见大开始就达拉斯注册钱包，卡视角打卡机上来看大家杀伤力就到啦看似简单啊啊盛见大开始就达拉斯。</p>
              </Col>
              <Col span={6}>
                <img alt="example" src={require('../../assets/create2.png')} />
                <h3>注册钱包</h3>
                <p>注册钱包，卡视角打卡机上来看大家杀伤力就到啦看似简单啊啊盛见大开始就达拉斯注册钱包，卡视角打卡机上来看大家杀伤力就到啦看似简单啊啊盛见大开始就达拉斯。</p>
              </Col>
              <Col span={6}>
                <img alt="example" src={require('../../assets/create3.png')} />
                <h3>注册钱包</h3>
                <p>注册钱包，卡视角打卡机上来看大家杀伤力就到啦看似简单啊啊盛见大开始就达拉斯注册钱包，卡视角打卡机上来看大家杀伤力就到啦看似简单啊啊盛见大开始就达拉斯。</p>
              </Col>
              <Col span={6}>
                <img alt="example" src={require('../../assets/create4.png')} />
                <h3>注册钱包</h3>
                <p>注册钱包，卡视角打卡机上来看大家杀伤力就到啦看似简单啊啊盛见大开始就达拉斯注册钱包，卡视角打卡机上来看大家杀伤力就到啦看似简单啊啊盛见大开始就达拉斯。</p>
              </Col>
            </Row>
          </div>
        </div>
        <div styleName='footer'>
          <Footer />
        </div>
      </div>
    )
  }
}