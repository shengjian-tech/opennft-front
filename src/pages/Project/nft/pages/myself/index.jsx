import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row,Col,Tabs,Card,Collapse } from 'antd'
import { preRouter } from 'src/commons/PRE_ROUTER'
import Header from '../../components/header'
import Footer from '../../components/footer'
import './style.less';


export default class nft_detail extends Component {
  state = {
    loading:false,
    data:[]
  };

  componentDidMount() {

  }
  callback(key){
    console.log(key)
  }
  render() {
    const { data } = this.state
    const { TabPane } = Tabs;
    return (
      <div styleName="collection">
        <div styleName='nav'>
          <Header />
        </div>
        <div styleName='banner'>
          <img alt="example" src={require('../../assets/collectionbanner.png')} />
        </div>
        <div styleName='people'>
          <img alt="example" src={require('../../assets/collectionavatar.png')} />
        </div>
        <div styleName='content'>
          <h2>NFT收藏者</h2>
          <p styleName='author'>0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/7769</p>
          <p styleName='date'>2021/12/16 加入</p>
        </div>
        <div styleName='similar'>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab={
              <div>
              <img style={{marginTop:'-5px'}} width='15px' heihgt='15px' alt="example" src={require('../../assets/similar.png')} />
              <span>&nbsp;&nbsp;收藏品16</span></div>
            } key="1">
            <Row gutter={30}>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner1.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner2.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner3.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner4.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner1.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner2.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner3.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner4.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner4.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner4.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner1.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner2.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner3.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner4.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner4.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
              <Col span={6}>
                <Card
                styleName='card'
                    hoverable
                    cover={<img alt="example" src={require('../../assets/detailbanner4.png')} />}
                  >
                    <Row>
                      <Col span={16}>
                        <p>Bored Ape Yac..</p>
                        <h3>4578</h3>
                      </Col>
                      <Col span={8} styleName='right'>
                        <p>价格</p>
                        <h3 styleName='price'><span></span>12.36</h3>
                      </Col>
                    </Row>
                  </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab={
              <div>
              <img style={{marginTop:'-5px'}} width='15px' heihgt='15px' alt="example" src={require('../../assets/creat.png')} />
              <span>&nbsp;&nbsp;创建的0</span></div>
            } key="2">
            暂无内容
          </TabPane>
          <TabPane tab={
              <div>
              <img style={{marginTop:'-5px'}} width='15px' heihgt='15px' alt="example" src={require('../../assets/file.png')} />
              <span>&nbsp;&nbsp;我的合集</span></div>
            } key="3">
            暂无内容
          </TabPane>
          <TabPane tab={
              <div>
              <img style={{marginTop:'-5px'}} width='15px' heihgt='15px' alt="example" src={require('../../assets/out.png')} />
              <span>&nbsp;&nbsp;交易历史</span></div>
            } key="4">
            暂无内容
          </TabPane>
          <TabPane tab={
              <div>
              <img style={{marginTop:'-5px'}} width='15px' heihgt='15px' alt="example" src={require('../../assets/star.png')} />
              <span>&nbsp;&nbsp;关注</span></div>
            } key="5">
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