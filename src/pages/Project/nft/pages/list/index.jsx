import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row,Col,Table, Button,Card,Select } from 'antd'
import { preRouter } from 'src/commons/PRE_ROUTER'
import Header from '../../components/header'
import Footer from '../../components/footer'
import './style.less';


export default class nft_list extends Component {
  state = {
    loading:false,
    columns:[
      {
        title: '热门合集', dataIndex: 'text', key: 'text',
        render: (value, record) => {
            const { text } = record;
            return (
              <div>
                <span><img width={20} height={20} alt="example" src={require('../../assets/out.png')} />&nbsp;&nbsp;{value}</span>
              </div>
            )
        },
      },
      {
        title: '交易额', dataIndex: 'a', key: 'a',
      },
      {
        title: '涨跌幅(24H)', dataIndex: 'b', key: 'b',
      },
      {
        title: '涨跌幅(7d)', dataIndex: 'c', key: 'c',
      },
      {
        title: '地板价', dataIndex: 'date', key: 'date',
      },
      {
        title: '持有人数', dataIndex: 'date', key: 'date',
      },
      {
        title: '数量', dataIndex: 'date', key: 'date',
      },
    ],
    data:[
      {text:'Bored Ape Yacht Club',a:'1',b:'HYAGJ',c:'CPPPP',date:'1天前'},
      {text:'Bored Ape Yacht Club',a:'1',b:'HYAGJ',c:'CPPPP',date:'1天前'},
      {text:'Bored Ape Yacht Club',a:'1',b:'HYAGJ',c:'CPPPP',date:'1天前'},
      {text:'Bored Ape Yacht Club',a:'1',b:'HYAGJ',c:'CPPPP',date:'1天前'},
      {text:'Bored Ape Yacht Club',a:'1',b:'HYAGJ',c:'CPPPP',date:'1天前'},
      {text:'Bored Ape Yacht Club',a:'1',b:'HYAGJ',c:'CPPPP',date:'1天前'},
      {text:'Bored Ape Yacht Club',a:'1',b:'HYAGJ',c:'CPPPP',date:'1天前'},
      {text:'Bored Ape Yacht Club',a:'1',b:'HYAGJ',c:'CPPPP',date:'1天前'},
      {text:'Bored Ape Yacht Club',a:'1',b:'HYAGJ',c:'CPPPP',date:'1天前'},
      {text:'Bored Ape Yacht Club',a:'1',b:'HYAGJ',c:'CPPPP',date:'1天前'},
    ]
  };

  componentDidMount() {

  }
  handleChange(value){
    console.log(value)
  }
  render() {
    const { Option } = Select;
    const { data,loading,columns } = this.state
    return (
      <div styleName="list">
        <div styleName='nav'>
          <Header />
        </div>
        <div styleName='content'>
          <h2>热门NFT排行榜</h2>
          <p>发现最热门的NFT收藏品，以及它们的市场排名和实时销售额。数据刷新频率：每小时。</p>
          <div styleName='search'>
            <Row gutter={30}>
              <Col span={8}>
                <Select defaultValue="7天" size='large' style={{ width: '100%' }} onChange={this.handleChange}>
                  <Option value="7天">7天</Option>
                  <Option value="一个月">一个月</Option>
                  <Option value="一年">一年</Option>
                </Select>
              </Col>
              <Col span={8}>
                <Select defaultValue="全部分类" size='large' style={{ width: '100%' }} onChange={this.handleChange}>
                  <Option value="一类">一类</Option>
                  <Option value="二类">二类</Option>
                  <Option value="三类">三类</Option>
                </Select>
              </Col>
              <Col span={8}>
                <Select defaultValue="多链" size='large' style={{ width: '100%' }} onChange={this.handleChange}>
                  <Option value="多链">多链</Option>
                  <Option value="单链">单链</Option>
                </Select>
              </Col>
            </Row>
          </div>
          <Table
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={false}
            style={{marginTop:'50px'}}
            rowKey="key"
          />
        </div>
        <div styleName='footer'>
          <Footer />
        </div>
      </div>
    )
  }
}