import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { message,Select,Form,Upload,Input } from 'antd'
import { WeiboCircleOutlined,WechatOutlined,QqOutlined,HeatMapOutlined,LoadingOutlined,PictureOutlined } from '@ant-design/icons'
import { FormItem } from 'src/commons/ra-lib';
import { Button,NavBar } from 'antd-mobile'
import { preRouter } from 'src/commons/PRE_ROUTER';
import Footer from '../../components/footer'
import './style.less';


function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

@config({
  path: '/nft_mobile_creatNft',
  ajax: true,
  noFrame: true,
  noAuth: true,
})

export default class creatNft extends Component {
  state = {
    loading: false,
    imageUrl:null,
  };

  componentDidMount() {
    
  }

  back = () =>{
    this.props.history.push(`${preRouter}/nft_mobile_create`)
  }

  render() {
    const { Option } = Select;
    const { loading,imageUrl} = this.state
    const uploadButton = (
      <div style={{textAlign:'center',lineHeight:'150px'}}>
        <div style={{ marginTop: 8 }}>{loading ? <LoadingOutlined /> : <PictureOutlined style={{fontSize:'80px'}} />}</div>
      </div>
    );
    return (
      <div styleName='list'>
        <div styleName='header'>
          <NavBar onBack={this.back}><img src={require('../../assets/logo.png')} alt="" /></NavBar>
        </div>
        <div styleName='details'>
          <h2>创建NFT作品</h2>
          <Form
            ref={form => this.form = form}
            onFinish={this.handleSubmit}
            layout='vertical'
          >
            <FormItem
              label="图片、视频、音乐、3D模型"
              name="pass"
              required
            >
              <p>可用的格式：JPG, PNG, GIF, SVG, GLB.  最大：100MB</p>
              <Upload
                name="avatar"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
              >
                <div style={{width:'300px',height:'150px',border:'2px dashed #6B6E71'}}>
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </div>
              </Upload>
            </FormItem>
            <FormItem
              label="名称"
              name="pass"
              size='large'
              placeholder='合集名称'
              required
            />
            <FormItem
              label="自定义链接"
              name="pass"
            >
              <p>MakerOne将在此项目的详细信息页面上包含指向此 URL 的链接，以便用户可以单击以了解更多信息。欢迎您链接到您自己的网页，了解更多详情。</p>
              <Input size="large" placeholder='https://yoursite.io/item/123'></Input>
            </FormItem>
            <FormItem
              label="作品简介"
              name="pass"
            >
              <p>描述将包含在项目的详细信息页面上，位于其图像下方</p>
              <Input size="large" type='textarea' placeholder='简单介绍一下您的合集'></Input>
            </FormItem>
            <FormItem
              label="选择合集"
              name="pass"
            >
              <p>选择您的作品将要添加到哪个合集里，如您还没有合集，请先创建合集。</p>
              <Select defaultValue="lucy" size='large' style={{ width: '100%' }}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </FormItem>
            <FormItem
              label="数量"
              name="pass"
            >
              <p>输入您的作品将要发行的数量。</p>
              <Input size="large" placeholder="2.5" />
            </FormItem>
            <FormItem>
              <Button block color='primary' style={{backgroundColor:'#2345A7',border:'none'}}>创建</Button>
            </FormItem>
          </Form>
        </div>
        <div styleName='footer'>
          <Footer history={this.props.history}/>
        </div>
      </div >
    );
  }
}