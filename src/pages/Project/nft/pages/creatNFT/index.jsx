import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {  Button,message,Select,Form,Upload,Input,Avatar } from 'antd'
import { LoadingOutlined,PictureOutlined,UploadOutlined} from '@ant-design/icons'
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

export default class nft_creatNFT extends Component {
  state = {
    imageUrl:null,
    loading:false,
    cateData:[],
    collData:[],
    dataPath:null,
    editorState:BraftEditor.createEditorState('<p></p>'),
    listData:[],
  };

  componentDidMount() {
    this.getCategory()
    this.getCollection()
    if(this.props.location.state && this.props.location.state.worksId){
      this.handleNFT()
    }
  }
  handleNFT(){
    const worksId = this.props.location.state.worksId
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_works_findWorks}?worksId=${worksId}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({
          listData:res.result,
          imageUrl:AJAX_PREFIXCONFIG + res.result.dataPath,
          dataPath:res.result.dataPath,
          editorState:BraftEditor.createEditorState(decodeURIComponent(res.result.details))
        })
        this.form.resetFields()
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  //获取合集数据
  getCategory(){
    this.props.ajax.post(`${CODEMAP.nft_collection_labelValuePair}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({collData:res.result})
      } else {
        message.error(res.message);
      }

    })
  }
  //获取类别数据
  getCollection(){
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
    const { dataPath,editorState, } = this.state
    console.log(editorState.toHTML())
    if(editorState == null || editorState == ''){
      message.warning('请确认作品简介全部编辑完成')
    }else if(!dataPath){
      message.error('请确认您的图片已上传！')
    }else{
      value.dataPath = dataPath
      value.details = encodeURIComponent(editorState.toHTML())
      this.setState({loading:true})
      if(this.props.location.state && this.props.location.state.worksId){
        value.id = this.props.location.state.worksId
        this.props.ajax.post(`${CODEMAP.nft_works_updateWorks}`, value).then(res => {
          if (res.statusCode == '200') {
            message.success(res.message ? res.message : '更新成功');
          } else {
            message.error(res.message ? res.message : '更新失败');
          }
        }).finally(() => this.setState({ loading: false }));
      }else{
        value.id = null
        this.props.ajax.post(`${CODEMAP.nft_works_createWorks}`, value).then(res => {
          if (res.statusCode == '200') {
            message.success(res.message ? res.message : '创建成功，页面1s后跳转合集市场');
            this.props.history.push(`${preRouter}/nft_market`)
          } else {
            message.error(res.message ? res.message : '创建失败');
          }
        }).finally(() => this.setState({ loading: false }));
      }
    }
    
  }
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({dataPath:info.file.response.result.fileURL})
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl:imageUrl,
          loading: false,
        }),
      );
    }
  };
  handleChangeEdit = (editorState) =>{
    this.setState({editorState:editorState})
  }

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
    const { loading,imageUrl,cateData,collData,editorState,listData } = this.state
    const uploadButton = (
      <div style={{textAlign:'center',lineHeight:'200px'}}>
        <div style={{ marginTop: 8 }}>{loading ? <LoadingOutlined /> : <UploadOutlined style={{fontSize:'60px',opacity:'0.5'}} />}</div>
      </div>
    );
    return (
      <div styleName="creatCollection">
        <div styleName='nav'>
          <Header />
        </div>
        <div styleName='content'>
          <h2>创建NFT</h2>
          <Form
            ref={form => this.form = form}
            onFinish={this.handleSubmit}
            initialValues={listData}
            layout='vertical'
          >
            <FormItem
              name="dataPath"
            >
              <div>
                <p>可用的格式：JPG, PNG, GIF, SVG.最大：20MB</p>
              </div>
              <Upload
                name="file"
                showUploadList={false}
                action={`${AJAX_PREFIXCONFIG}${CODEMAP.t_attachment_upload}`}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
                headers={{contentType: 'multipart/form-data',jwttoken:`${JSON.parse(sessionStorage.getItem('login-user')).token}`}}
                data={{type:0}}
              >
                {imageUrl ? <div style={{width:'300px',height:'200px',overflow:'hidden'}}><img src={imageUrl} alt="avatar" style={{ height: '100%' }} /></div> 
                : <div style={{width:'300px',height:'200px',border:'2px dashed #6B6E71'}}>{uploadButton}</div>}
              </Upload>
            </FormItem>
            <FormItem
              label="名称"
              name="name"
              size='large'
              placeholder='合集名称'
              required
            />
            <FormItem
              label="自定义链接"
              name="link"
            >
              <div>
                <p>MakerOne将在此项目的详细信息页面上包含指向此 URL 的链接，以便用户可以单击以了解更多信息。欢迎您链接到您自己的网页，了解更多详情。</p>
                <Input size="large" placeholder='https://yoursite.io/item/123'></Input>
              </div>
            </FormItem>
            <FormItem
              label="选择合集"
              name="collectionId"
              required
            >
              <Select size='large' placeholder='请选择合集'>
                {collData ? collData.map((item)=>
                  <Option value={item.value}>{item.label}</Option>
                ) : null}
              </Select>
            </FormItem>         
            <FormItem
              label="类别"
              name="type"
              required
            >
              <Select size='large' placeholder='请选择类别'>
                {cateData ? cateData.map((item)=>
                  <Option value={item.value}>{item.label}</Option>
                ) : null}
              </Select>
            </FormItem>
            <FormItem
              label="数量"
              name="num"
              required
            >
              <div>
                <p>输入您的作品将要发行的数量。(只能输入数字哦)</p>
                <Input size="large" defaultValue={listData?.num} placeholder="2.5" type='number'/>
              </div>
            </FormItem>
            <FormItem
              label="作品简介"
              name="details"
            >
              <p>描述您的合集，字数在500字以内</p>
              <div style={{width:'100%',minHeight:'300px',border:'1px solid gray'}}>
                <BraftEditor excludeControls={extendControls} value={editorState} onChange={this.handleChangeEdit} media={{uploadFn: this.myUploadFn}}/>
              </div>
            </FormItem>
            <FormItem>
              {this.props.location.state && this.props.location.state.worksId ? <Button type='primary' htmlType="submit" size='large' style={{width:'100%'}}>修改</Button>
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