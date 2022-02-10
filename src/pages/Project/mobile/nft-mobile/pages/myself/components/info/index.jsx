import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import { message,Form,Upload,Avatar,Button,Row,Col,Input } from 'antd';
import { LoadingOutlined, UploadOutlined, PictureOutlined} from '@ant-design/icons'
import { FormItem } from 'src/commons/ra-lib';
import { Link } from 'react-router-dom'
import { NavBar,Modal } from 'antd-mobile'
import { locationHref } from 'src/commons'
import { preRouter,AJAX_PREFIXCONFIG } from 'src/commons/PRE_ROUTER';
import Footer from '../../../../components/footer'
import './style.less';
import { getJSSDK } from 'src/commons/share';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

getJSSDK('MakerOne 个人中心认证','赶快认证您的个人信息，可以在平台进行更多操作哦',null)

// function beforeUpload(file) {
//   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//   if (!isJpgOrPng) {
//     message.error('请注意上传的文件格式!');
//   }
//   const isLt2M = file.size / 1024 / 1024 < 20;
//   if (!isLt2M) {
//     message.error('图片大小不超过20MB!');
//   }
//   return isJpgOrPng && isLt2M;
// }
// function getBase64(img, callback) {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result));
//   reader.readAsDataURL(img);
// }

@config({
  path: '/nft_mobile_myself_info',
  ajax: true,
  noFrame: true,
  noAuth: true,
})
export default class Myself_Info extends Component {
  state = {
    loading: false,
    imageUrl:null,
    avatar:null,
    captchaData:null,
    visible:false,
    codeValue:null,
    codeState:false,
    visibleSub:false,
    subData:null,
    num:60,
  };

  componentDidMount() {
    
  }
  // handleChange = info => {
  //   if (info.file.status === 'uploading') {
  //     this.setState({ loading: true });
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     this.setState({avatar:info.file.response.result.fileURL})
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, imageUrl =>
  //       this.setState({
  //         imageUrl:imageUrl,
  //         loading: false,
  //       }),
  //     );
  //   }
  // };
  //获取图片验证码
  getCaptcha = () => {
    if(this.form.getFieldValue('mobile')){
      this.setState({visible:true})
      this.props.ajax.post(`api/getCaptcha`, null, { errorTip: true, noEmpty: true }).then(res => {
        if(res.status == 'success' && res.statusCode == 200){
          this.setState({
            captchaData: res.result
          })
        }else{
          message.error(res.message)
        }
      })
    }else{
      message.warning('请先输入手机号')
    }
  }
  //60s倒计时
  handleCountDown = (seconds = 60) => {
    // let second = 60;
    let second = seconds;
    const countDown = ()=> {
        // timer && clearTimeout(timer); //清除计时器
        if( second > 0){
            // let second =
            // countDownSecond--;
            // let a  = countDownSecond - 1;
            second--;
            this.setState( {num:second} );
        }
        if( second === 0 ){
            /*
                _this.countDown = 60;//恢复60s设定
                _this.isVerify = false;//不显示60s计时器
                clearTimeout(count60Timeout)//清除计时器
                return //结束方法的调用
            */
            second = 60;
            this.setState( {num:second,codeState:false} );
            // clearTimeout( timer ); //清除计时器
            return;
        }
        // let timer = setTimeout( countDown,1000 );
        setTimeout( countDown,1000 );
    };
    setTimeout( countDown,1000 );
};
  //获取手机验证码
  getCode = () => {
    const { captchaData,codeValue } = this.state
    const params = {
      phone:this.form.getFieldValue('mobile'),
      captchaKey:captchaData.captchaKey,
      code:codeValue
    }
    this.props.ajax.post(`/api/sendCode`, params, { errorTip: true, noEmpty: true }).then(res => {
      if(res.status=='success' && res.statusCode == 200){
        message.success(res.message)
        this.handleCountDown(60)
        this.setState({visible:false,codeState:true})
      }else{
        message.error(res.message)
        this.getCaptcha()
      }
    })
  }
  getCodeValue=(e)=>{
    this.setState({codeValue:e.target.value})
  }
  getIfInfo(){
    this.props.ajax.post(`/api/nft/login/haveCurrentUserInfo`).then(res =>{
      if (res.status == 'success' && res.statusCode == '200') {
        sessionStorage.setItem('ifInfo',res.result)
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  handleSubmit = (value) =>{
    // const { avatar,} = this.state
    // value.avatar = avatar
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_login_userInfoInit}`, value).then(res => {
      if (res.statusCode == '200' && res.status == 'success') {
        this.getIfInfo()
        message.success(res.message ? res.message : '操作成功');
        this.setState({visibleSub:true,subData:res.result[0]})
      } else {
        message.error(res.message ? res.message : '操作失败');
      }
    }).finally(() => this.setState({ loading: false })); 
}
  //列表数据
  handleHistory(){
    this.setState({loading:true})
    this.props.ajax.post(`${CODEMAP.nft_mobile_order_findTransHis}`).then(res => {
      if (res.status == 'success' && res.statusCode == '200') {
        this.setState({hisData:res.result})
      } else {
        message.error(res.message);
      }
    }).finally(() => this.setState({ loading: false }));
  }
  back = () =>{
    this.props.history.push(`${preRouter}/nft_mobile_myself`)
  }
  render() {
    const { loading,imageUrl,visible,captchaData,codeState,visibleSub,subData,num } = this.state
    // const uploadButton = (
    //   <div style={{textAlign:'center',lineHeight:'80px'}}>
    //     <div style={{ marginTop: 8 }}>{loading ? <LoadingOutlined /> : <UploadOutlined style={{fontSize:'20px',opacity:'0.5'}} />}</div>
    //   </div>
    // );
    return (
      <div styleName='list'>
        <div styleName='header'>
          <NavBar onBack={this.back}><img src={require('../../../../assets/logo.png')} alt="" /></NavBar>
        </div>
        <div styleName='details'>
          <h2>个人中心</h2>
          <Form
            ref={form => this.form = form}
            onFinish={this.handleSubmit}
            layout='vertical'
          >
            {/* <FormItem
              name="avatar"
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
                  {imageUrl ? <div style={{width:'100px',height:'100px',borderRadius:'50%',overflow:'hidden'}}><Avatar src={imageUrl} alt="avatar" style={{ width: '100%',height:'100%'}} /></div> 
                  : <div style={{width:'100px',height:'100px',border:'2px dashed #6B6E71',borderRadius:'50%'}}>{uploadButton}</div>}
              </Upload>
            </FormItem> */}
            <FormItem
              label="用户名称"
              name="userName"
              size='large'
              required
            />
            <Row gutter={20}>
              <Col span={12}>
                <FormItem
                  label="百度超级链address"
                  name="bindAddress"
                  size='large'
                  required
                />
              </Col>
              <Col span={12}>
                <div style={{marginTop:'35px'}}>
                  <a href="https://xuper.baidu.com/n/doc#/e76de83b/1_0_0/8e08d21d" target='_blank'>查看帮助</a>
                </div>
              </Col>
            </Row>
            {/* <FormItem
              label="账号"
              name="account"
              size='large'
              required
            />
            <FormItem
              label="密码"
              name="password"
              size='large'
              type='password'
              required
            /> */}
            {/* <FormItem
              label="性别"
              name="sex"
              size='large'
              type='radio-group'
              options={[
                {value:'男',label:'男'},
                {value:'女',label:'女'}
              ]}
              required
            /> */}
            {/* <FormItem
              label="邮箱"
              name="email"
              size='large'
              type='email'
              required
            /> */}
            <FormItem
              label="邮箱"
              name="email"
              size='large'
              required
            />
            <FormItem
              label="手机"
              name="mobile"
              size='large'
              rules={[{ required: true, message: '请输入手机号' }, { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请输入正确的手机号' }]}
              required
            />
            <Row gutter={30}>
              <Col span={14}>
                <FormItem
                  label="验证码"
                  name="verificationCode"
                  size='large'
                  required
                />
              </Col>
              <Col span={10}>
                {codeState == true ? <Button type='primary' size='large' style={{marginTop:'28px'}} disabled>短信已发送({num})</Button>
                : <Button onClick={()=>this.getCaptcha()} style={{marginTop:'28px'}} type='primary' size='large'>获取短信验证码</Button>}
              </Col>
            </Row>
            <FormItem>
              {sessionStorage.getItem('ifInfo') == 'true' ? <Button type='primary'size='large' style={{width:'100%'}} disabled>已完善</Button>
              : <Button type='primary' htmlType="submit" size='large' style={{width:'100%'}}>提交</Button>}
            </FormItem>
          </Form>
        </div>
        <Modal
          visible={visible}
          showCloseButton
          content={
            <div style={{textAlign:'center'}}>
              <img style={{margin:'10px 0 10px 0'}} onClick={() => { this.getCaptcha() }} src={captchaData?.imageBase64} alt="" />
              <Input onChange={this.getCodeValue} size='large' placeholder='请输入图片验证码'></Input>
            </div>
          }
          closeOnAction
          onAction={()=>this.getCode()}
          onClose={() =>this.setState({visible:false})}
          actions={[
            {
              key: 'confirm',
              text: '确认',
            },
          ]}
        />
        <Modal
          visible={visibleSub}
          content={
            <p>已为您完善信息！</p>
          }
          closeOnAction
          onClose={() =>{this.setState({visibleSub:false});locationHref(`${preRouter}/nft_mobile_myself`)}}
          actions={[
            {
              key: 'confirm',
              text: '我知道了',
            },
          ]}
      />
        <div styleName='footer'>
          <Footer history={this.props.history}/>
        </div>
      </div >
    );
  }
}