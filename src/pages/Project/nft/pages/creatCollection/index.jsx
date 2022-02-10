import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {  Button,message,Select,Form,Upload,Input,Avatar } from 'antd'
import { LoadingOutlined, UploadOutlined, PictureOutlined} from '@ant-design/icons'
import { FormItem } from 'src/commons/ra-lib';
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER'
import BraftEditor from 'braft-editor'
import Header from '../../components/header'
import Footer from '../../components/footer'
import config from 'src/commons/config-hoc';
import './style.less';
import 'braft-editor/dist/index.css'

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

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
  ajax: true,
})


export default class nft_creatCollection extends Component {
  state = {
    imageUrl:null,
    imageUrl1:null,
    imageUrl2:null,
    listData:null,
    loading:false,
    loading1:false,
    loading2:false,
    cateData:[],
    logoPath:null,
    coverPath:null,
    bannerPath:null,
    editorState:BraftEditor.createEditorState('<p></p>'),
  };

  componentDidMount() {
    this.getCategory()
    if(this.props.location.state && this.props.location.state.collectionId){
      this.handleCollection()
    }
  }
  handleCollection(){
    const id = this.props.location.state.collectionId
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_collection_colletionDetail}?nftCollectionId=${id}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({
          listData:res.result,
          imageUrl:AJAX_PREFIXCONFIG + res.result.logoPath,
          imageUrl1:AJAX_PREFIXCONFIG + res.result.coverPath,
          imageUrl2:AJAX_PREFIXCONFIG + res.result.bannerPath,
          logoPath:res.result.logoPath,
          coverPath:res.result.coverPath,
          bannerPath:res.result.bannerPath,
          editorState:BraftEditor.createEditorState(decodeURIComponent(res.result.details))
        })
        this.form.resetFields()
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  //获取类别数据
  getCategory(){
    this.props.ajax.post(`${CODEMAP.nft_type_list}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({cateData:res.result})
      } else {
        message.error(res.message);
      }

    })
  }
  // 提交
  handleSubmit = (value) =>{
    const { logoPath,coverPath,bannerPath,editorState } = this.state
    if(!logoPath || !coverPath || !bannerPath){
      message.error('请确认您的图片已上传！')
    }else if(!editorState){
      message.warning('请确认作品简介全部编辑完成')
    }else{
      value.logoPath = logoPath
      value.coverPath = coverPath
      value.bannerPath = bannerPath
      value.details = encodeURIComponent(editorState.toHTML())
      if(this.props.location.state && this.props.location.state.collectionId){
        value.id = this.props.location.state.collectionId
        this.props.ajax.post(`${CODEMAP.nft_collection_update}`, value).then(res => {
          if (res.statusCode == '200') {
            message.success(res.message ? res.message : '更新成功');
            // this.props.history.push(`${preRouter}/nft_market`)
          } else {
            message.error(res.message ? res.message : '更新失败');
          }
        })
      }else{
        value.id = null
        this.props.ajax.post(`${CODEMAP.nft_collection_create}`, value).then(res => {
          if (res.statusCode == '200') {
            message.success(res.message ? res.message : '创建成功，页面1s后跳转合集市场');
            this.props.history.push(`${preRouter}/nft_market`)
          } else {
            message.error(res.message ? res.message : '创建失败');
          }
        })
      }
    }
  }
  handleChangeEdit = (editorState) =>{
    this.setState({editorState:editorState})
  }
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({logoPath:info.file.response.result.fileURL})
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl:imageUrl,
          loading: false,
        }),
      );
    }
  };
  handleChange1 = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading1: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({coverPath:info.file.response.result.fileURL})
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl1 =>
        this.setState({
          imageUrl1:imageUrl1,
          loading1: false,
        }),
      );
    }
  };
  handleChange2 = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading2: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({bannerPath:info.file.response.result.fileURL})
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl2 =>
        this.setState({
          imageUrl2:imageUrl2,
          loading2: false,
        }),
      );
    }
  };
  myUploadFn = async (param) => {
    const formData = new FormData();
    formData.append('file', param.file);
    const res = await fetch(`${AJAX_PREFIXCONFIG}/api/nft/userassets/upload`, {
        method: 'POST',
        headers: {
            jwttoken: `${localStorage.getItem('token')}`,
        },
        body: formData
    }).then(response => response.json())
    if (res.statusCode === 200) {
        param.success({url:res.result})   //success需要一个有url属性的对象{url:'...'}
    } else {
        param.error({
            msg: '上传错误'
        })
    }
  }

  render() {
    const extendControls = ['list-ul','list-ol']
    const { Option } = Select; 
    const { loading,loading1,loading2,imageUrl,imageUrl1,imageUrl2,cateData,editorState,listData } = this.state
    const uploadButton = (
      <div style={{textAlign:'center',lineHeight:'150px'}}>
        <div style={{ marginTop: 8 }}>{loading ? <LoadingOutlined /> : <UploadOutlined style={{fontSize:'40px',opacity:'0.5'}} />}</div>
      </div>
    );
    const uploadButton1 = (
      <div style={{textAlign:'center',lineHeight:'150px'}}>
        <div style={{ marginTop: 8 }}>{loading1 ? <LoadingOutlined /> : <UploadOutlined style={{fontSize:'60px',opacity:'0.5'}} />}</div>
      </div>
    );
    const uploadButton2 = (
      <div style={{textAlign:'center',lineHeight:'100px'}}>
        <div style={{ marginTop: 8 }}>{loading2 ? <LoadingOutlined /> : <UploadOutlined style={{fontSize:'60px',opacity:'0.5'}} />}</div>
      </div>
    );
    return (
      <div styleName="creatCollection">
        <div styleName='nav'>
          <Header />
        </div>
        <div styleName='content'>
          <h2>创建合集</h2>
          <Form
            ref={form => this.form = form}
            onFinish={this.handleSubmit}
            layout='vertical'
            initialValues={listData}
          >
            <FormItem
              label="LOGO图片"
              name="logoPath"
              // required
            >
              <p>建议使用150*150等比例图片</p>
              <Upload
                name="file"
                showUploadList={false}
                action={`${AJAX_PREFIXCONFIG}${CODEMAP.t_attachment_upload}`}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
                headers={{contentType: 'multipart/form-data',jwttoken:`${JSON.parse(sessionStorage.getItem('login-user')).token}`}}
                data={{type:0}}
              >
                  {imageUrl ? <div style={{width:'150px',height:'150px',borderRadius:'50%',overflow:'hidden'}}><Avatar src={imageUrl} alt="avatar" style={{ width: '100%',height:'100%'}} /></div> 
                  : <div style={{width:'150px',height:'150px',border:'2px dashed #6B6E71',borderRadius:'50%'}}>{uploadButton}</div>}
              </Upload>
            </FormItem>
            <FormItem
              label="合集封面"
              name="coverPath"
              // required
            >
              <p>建议使用300*150等比例图片</p>
              <Upload
                name="file"
                showUploadList={false}
                action={`${AJAX_PREFIXCONFIG}${CODEMAP.t_attachment_upload}`}
                beforeUpload={beforeUpload}
                onChange={this.handleChange1}
                headers={{contentType: 'multipart/form-data',jwttoken:`${JSON.parse(sessionStorage.getItem('login-user')).token}`}}
                data={{type:0}}
              >
                {imageUrl1 ? <div style={{width:'300px',height:'150px',overflow:'hidden'}}><img src={imageUrl1} alt="avatar" style={{ height: '100%' }} /></div> 
                : <div style={{width:'300px',height:'150px',border:'2px dashed #6B6E71'}}>{uploadButton1}</div>}
              </Upload>
            </FormItem>
            <FormItem
              label="Banner图片"
              name="bannerPath"
              // required
            >
              <p>建议使用800*100等比例图片</p>
              <Upload
                name="file"
                showUploadList={false}
                action={`${AJAX_PREFIXCONFIG}${CODEMAP.t_attachment_upload}`}
                beforeUpload={beforeUpload}
                onChange={this.handleChange2}
                headers={{contentType: 'multipart/form-data',jwttoken:`${JSON.parse(sessionStorage.getItem('login-user')).token}`}}
                data={{type:0}}
              >
                {imageUrl2 ? <div style={{width:'800px',height:'100px',overflow:'hidden'}}><img src={imageUrl2} alt="avatar" style={{ height: '100%' }} /></div> 
                : <div style={{width:'800px',height:'100px',border:'2px dashed #6B6E71'}}>{uploadButton2}</div>}
              </Upload>
            </FormItem>
            <FormItem
              name="name"
              label='名称'
              size='large'
              placeholder='合集名称'
              required
            />
            {/* <FormItem
              label="自定义链接"
              name="link"
              extra="MakerOne将在此项目的详细信息页面上包含指向此 URL 的链接，以便用户可以单击以了解更多信息。欢迎您链接到您自己的网页，了解更多详情。"
            >
              <Input size="large" placeholder='https://yoursite.io/item/123'></Input>
            </FormItem> */}
            <FormItem
              label="类别"
              name="type"
              type='select'
              required
            >
                <Select size='large' placeholder='请选择类别'>
                  {cateData?.map((item)=>
                    <Option value={item.value}>{item.label}</Option>
                  )}
                </Select>
            </FormItem>
            <FormItem
              label='版税'
              name="royalties"
              required
            >
              <div>
                <div>
                  <h3>百分比费用</h3>
                  <p>当用户转售您最初创建的项目时收取费用。这将从最终销售价格中扣除，并每月支付到您的地址。</p>
                </div>
                <Input defaultValue={listData?.royalties} size="large" placeholder="2.5" type='number'/>
              </div>
            </FormItem>
            <FormItem
              label="合集简介"
              name="details"
            >
              <p>描述您的合集，字数在500字以内</p>
              <div style={{width:'100%',minHeight:'300px',border:'1px solid gray'}}>
                <BraftEditor excludeControls={extendControls} value={editorState} onChange={this.handleChangeEdit} media={{uploadFn: this.myUploadFn}}/>
              </div>
            </FormItem>
            {/* <FormItem
              label="社交链接"
              name="bak1"
            >
              <Input size="large" placeholder="https://" prefix={<HeatMapOutlined />} />
            </FormItem>
            <FormItem
              name="bak2"
            >
              <Input size="large" placeholder="https://" prefix={<WeiboCircleOutlined />} />
            </FormItem>
            <FormItem
              name="bak3"
            >
              <Input size="large" placeholder="https://" prefix={<WechatOutlined />} />
            </FormItem>
            <FormItem
              name="bak4"
            >
              <Input size="large" placeholder="https://" prefix={<QqOutlined />} />
            </FormItem> */}
            <FormItem>
              {this.props.location.state && this.props.location.state.collectionId ? <Button type='primary' htmlType="submit" size='large' style={{width:'100%'}}>修改</Button>
              : <Button type='primary' htmlType="submit" size='large' style={{width:'100%'}}>创建</Button>}
            </FormItem>
          </Form>
        </div>
        <div styleName='footer'>
          <Footer />
        </div>
      </div>
    )
  }
}