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
  //??????????????????
  getCategory(){
    this.props.ajax.post(`${CODEMAP.nft_collection_labelValuePair}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({collData:res.result})
      } else {
        message.error(res.message);
      }

    })
  }
  //??????????????????
  getCollection(){
    this.props.ajax.post(`${CODEMAP.nft_type_list}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({cateData:res.result})
      } else {
        message.error(res.message);
      }

    })
  }
  // ??????
  handleSubmit = (value) =>{
    const { dataPath,editorState, } = this.state
    console.log(editorState.toHTML())
    if(editorState == null || editorState == ''){
      message.warning('???????????????????????????????????????')
    }else if(!dataPath){
      message.error('?????????????????????????????????')
    }else{
      value.dataPath = dataPath
      value.details = encodeURIComponent(editorState.toHTML())
      this.setState({loading:true})
      if(this.props.location.state && this.props.location.state.worksId){
        value.id = this.props.location.state.worksId
        this.props.ajax.post(`${CODEMAP.nft_works_updateWorks}`, value).then(res => {
          if (res.statusCode == '200') {
            message.success(res.message ? res.message : '????????????');
          } else {
            message.error(res.message ? res.message : '????????????');
          }
        }).finally(() => this.setState({ loading: false }));
      }else{
        value.id = null
        this.props.ajax.post(`${CODEMAP.nft_works_createWorks}`, value).then(res => {
          if (res.statusCode == '200') {
            message.success(res.message ? res.message : '?????????????????????1s?????????????????????');
            this.props.history.push(`${preRouter}/nft_market`)
          } else {
            message.error(res.message ? res.message : '????????????');
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
        param.success({url:res.result})   //success???????????????url???????????????{url:'...'}
    } else {
        param.error({
            msg: '????????????'
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
          <h2>??????NFT</h2>
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
                <p>??????????????????JPG, PNG, GIF, SVG.?????????20MB</p>
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
              label="??????"
              name="name"
              size='large'
              placeholder='????????????'
              required
            />
            <FormItem
              label="???????????????"
              name="link"
            >
              <div>
                <p>MakerOne?????????????????????????????????????????????????????? URL ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>
                <Input size="large" placeholder='https://yoursite.io/item/123'></Input>
              </div>
            </FormItem>
            <FormItem
              label="????????????"
              name="collectionId"
              required
            >
              <Select size='large' placeholder='???????????????'>
                {collData ? collData.map((item)=>
                  <Option value={item.value}>{item.label}</Option>
                ) : null}
              </Select>
            </FormItem>         
            <FormItem
              label="??????"
              name="type"
              required
            >
              <Select size='large' placeholder='???????????????'>
                {cateData ? cateData.map((item)=>
                  <Option value={item.value}>{item.label}</Option>
                ) : null}
              </Select>
            </FormItem>
            <FormItem
              label="??????"
              name="num"
              required
            >
              <div>
                <p>??????????????????????????????????????????(?????????????????????)</p>
                <Input size="large" defaultValue={listData?.num} placeholder="2.5" type='number'/>
              </div>
            </FormItem>
            <FormItem
              label="????????????"
              name="details"
            >
              <p>??????????????????????????????500?????????</p>
              <div style={{width:'100%',minHeight:'300px',border:'1px solid gray'}}>
                <BraftEditor excludeControls={extendControls} value={editorState} onChange={this.handleChangeEdit} media={{uploadFn: this.myUploadFn}}/>
              </div>
            </FormItem>
            <FormItem>
              {this.props.location.state && this.props.location.state.worksId ? <Button type='primary' htmlType="submit" size='large' style={{width:'100%'}}>??????</Button>
              : <Button type='primary' htmlType="submit" size='large' style={{width:'100%'}}>??????</Button>}
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