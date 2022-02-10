import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { message,Table,Avatar} from 'antd';
import { Button } from 'antd-mobile'
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER';
import Footer from '../../components/footer'
import './style.less';
import { getJSSDK } from 'src/commons/share';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

getJSSDK('MakerOne 合集排行榜','收录所有精彩合集，系统核酸后进行榜单排名，快来看看你的合集排名多少吧',null)

@config({
  path: '/nft_mobile_list',
  ajax: true,
  noFrame: true,
  noAuth: true,
})
export default class List extends Component {
  state = {
    loading: false,
    columns:[
      {
        title: '热门合集', dataIndex: 'collectionName', key: 'text', 
        render: (value, record,index) => {
          const { logoPath } = record
            return(
              <div>
                <Avatar size={30} src={AJAX_PREFIXCONFIG + logoPath}/>
                &nbsp;<span>{value}</span>
              </div>
            )
        },
      },
      { title: '涨跌幅(24h)', dataIndex: 'dayChange', key: 'createTime' },
      { title: '地板价', dataIndex: 'lowPrice', key: 'createTime', }
    ],
    data:[]
  };

  componentDidMount() {
    this.handleList()
  }

  //列表数据
  handleList(){
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_order_rankingFindAll}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({data:res.result})
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  render() {
    const { loading,columns,data} = this.state
    return (
      <div styleName='list'>
        <div styleName='header'>
          <img src={require('../../assets/logo.png')} alt="" />
        </div>
        <div styleName='details'>
          <h2>排行榜</h2>
          <Table
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey="key"
          />
        </div>
        <div styleName='footer'>
          <Footer history={this.props.history}/>
        </div>
      </div >
    );
  }
}