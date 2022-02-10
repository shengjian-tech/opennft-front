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
  path: '/nft_mobile_creatCollection',
  ajax: true,
  noFrame: true,
  noAuth: true,
})

export default class creatCollection extends Component {
  state = {
    loading: false,
    imageUrl:null,
  };

  componentDidMount() {
    
  }
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };
  back = () =>{
    this.props.history.push(`${preRouter}/nft_mobile_create`)
  }
  render() {
    const { Option } = Select;
    const { loading,imageUrl} = this.state
    const uploadButton = (
      <div style={{textAlign:'center',lineHeight:'100px'}}>
        <div style={{ marginTop: 8 }}>{loading ? <LoadingOutlined /> : <PictureOutlined style={{fontSize:'30px'}} />}</div>
      </div>
    );
    const uploadButton1 = (
      <div style={{textAlign:'center',lineHeight:'100px'}}>
        <div style={{ marginTop: 8 }}>{loading ? <LoadingOutlined /> : <PictureOutlined style={{fontSize:'30px'}} />}</div>
      </div>
    );
    const uploadButton2 = (
      <div style={{textAlign:'center',lineHeight:'150px'}}>
        <div style={{ marginTop: 8 }}>{loading ? <LoadingOutlined /> : <PictureOutlined style={{fontSize:'50px'}} />}</div>
      </div>
    );
    return (
      <div styleName='creatCollection'>
        <div styleName='header'>
          <NavBar onBack={this.back}><img src={require('../../assets/logo.png')} alt="" /></NavBar>
        </div>
        <div styleName='details'>
          <h2>创建合集</h2>
          <Form
            ref={form => this.form = form}
            onFinish={this.handleSubmit}
            layout='vertical'
          >
            <FormItem
              label="LOGO图片"
              name="pass"
              required
            >
              <p>建议使用 350 x 350px</p>
              <Upload
                name="avatar"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
              >
                <div style={{width:'100px',height:'100px',border:'2px dashed #6B6E71',borderRadius:'50%'}}>
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </div>
              </Upload>
            </FormItem>
            <FormItem
              label="合集封面"
              name="pass"
              required
            >
              <p>此图像将用于在主页、类别页面或 MakerOne 的其他宣传区域展示您的收藏。建议使用 600 x 400px。</p>
              <Upload
                name="avatar"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
              >
                <div style={{width:'200px',height:'100px',border:'2px dashed #6B6E71'}}>
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton1}
                </div>
              </Upload>
            </FormItem>
            <FormItem
              label="Banner图片"
              name="pass"
              required
            >
              <p>此图片将显示在您的收藏页面顶部。避免在此横幅图像中包含过
多文本，因为尺寸在不同设备上会发生变化。建议使用
1400 x 400px。</p>
              <Upload
                name="avatar"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
              >
                <div style={{width:'300px',height:'150px',border:'2px dashed #6B6E71'}}>
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton2}
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
              label="合集简介"
              name="pass"
            >
              <p>描述您的合集，字数在500字以内</p>
              <Input size="large" type='textarea' placeholder='简单介绍一下您的合集'></Input>
            </FormItem>
            <FormItem
              label="类别"
              name="pass"
            >
              <p>添加类别将有助于您的项目在 OpenSea 上被发现。</p>
              <Select defaultValue="lucy" size='large' style={{ width: '100%' }}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </FormItem>
            <FormItem
              label="社交链接"
              name="pass"
            >
              <Input size="large" placeholder="https://" prefix={<HeatMapOutlined />} />
              <Input size="large" placeholder="https://" prefix={<WeiboCircleOutlined />} />
              <Input size="large" placeholder="https://" prefix={<WechatOutlined />} />
              <Input size="large" placeholder="https://" prefix={<QqOutlined />} />
            </FormItem>
            <FormItem
              label="版税"
              name="pass"
            >
              <p>当用户转售您最初创建的项目时收取费用。这将从最终销售价格中扣除，并每月支付到您的地址。</p>
              <h3>百分比费用</h3>
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