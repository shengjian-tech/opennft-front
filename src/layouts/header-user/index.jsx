import React, { useEffect, useState } from 'react';
import config from 'src/commons/config-hoc';
import { EditOutlined, LogoutOutlined, UserOutlined,DownOutlined,AliwangwangOutlined,CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { HeaderUser } from 'src/commons/ra-lib';
import ModifyPassword from './ModifyPassword';
import { toLogin,locationHref } from 'src/commons';
import { preRouter } from 'src/commons/PRE_ROUTER';
import UserCenterModel from '../user-center/index'
import { message,Badge,Button,Menu,Dropdown,Tooltip,Row,Col } from 'antd';
export default config({
  connect: state => ({
    theme: state.layout.theme,
    loginUser: state.layout.loginUser,
  }),
})(function LayoutHeaderUser(props) {
  const { theme, loginUser } = props;
  const [visible, setVisible] = useState(false);
  const [visibleDrop,setVisibleDrop] = useState(false)
  const [center, setCenter] = useState(false);
  const [data,setData] = useState([])
  const [count,setCount] = useState(0)

  function handleLogout() {
    props.ajax.post('api/system/logout').then(res => {
      if (res.statusCode == 200) {
        // toLogin()
        
        if(localStorage.getItem('lout') == 1){
          locationHref(`${preRouter}/loginBaas`);
        }else if(localStorage.getItem('lout') == 2){
          locationHref(`${preRouter}/loginShare`);
        }else if(localStorage.getItem('lout') == 3){
          locationHref(`${preRouter}/loginAssets`);
        }else{
          toLogin()
        }
        clearAllCookie()
        localStorage.removeItem('userid')
        localStorage.removeItem('token')
        localStorage.removeItem('userType')
        localStorage.removeItem('lout')
      } else {
        message.error(res.message)
      }
    });
  }
  //清除所有cookie函数  
  function clearAllCookie() {  
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);  
    if(keys) {  
        for(var i = keys.length; i--;)  
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()  
    }  
  }  
  function handleMessage() {
    props.ajax.post('api/system/notify/message').then(res => {
      if (res.statusCode == 200) {
        if(res.result){
          setData(res.result)
          setCount(res.result.length)
        }
      } else {
        message.error(res.message)
      }
    });
  }
  function handleState(id){
    props.ajax.post(`api/system/notify/updatemassagestatus?id=${id}`).then(res => {
      if (res.statusCode == 200) {
        handleMessage()
      } else {
        message.error(res.message)
      }
    });
  }
  function handleVisibleChange(flag){
    setVisibleDrop(flag)
  }
  useEffect(() => {
    handleMessage();
    setInterval(()=>{
      handleMessage();
    },10000)
  }, []);
  const menu = (
    <Menu>
      {data && data.length > 0 ? data.map((item)=>
        <Menu.Item key={item.id}>
          {item.url ? <Link to={item.url} style={{maxWidth:'300px'}}>{item.content}</Link> 
          : <span style={{maxWidth:'300px',overflow:'hidden',textOverflow:'ellipsis'}}>{item.content}</span>}
          <Tooltip title="标记为已读！" placement="topLeft">
            <Button style={{float:'right'}} type='link' onClick={()=>handleState(item.id)}><CheckCircleOutlined /></Button>
          </Tooltip>
        </Menu.Item>
      ) : <span style={{padding:'30px'}}>暂无系统消息</span>}
    </Menu>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
      <div style={{marginRight:'20px'}}>
      <Badge count={count} size='small'>
        <Dropdown overlay={menu} onVisibleChange={handleVisibleChange} visible={visibleDrop}>
          <Button type='link' size='small' style={{color:'#fff'}}>
              系统消息 <DownOutlined />
          </Button>
        </Dropdown>
      </Badge>
      </div>
      <HeaderUser
        theme={theme}
        menus={[
          {
            text: <><EditOutlined />修改密码</>,
            onClick: () => setVisible(true),
          },
          {
            text: <><UserOutlined />个人中心</>,
            onClick: () => setCenter(true),
          },
          {
            text: 'Divider',
          },
          {
            text: <><LogoutOutlined />退出登录</>,
            onClick: () => handleLogout(),
          },
        ]}
        loginUser={loginUser}
      />
      <ModifyPassword
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      />
      <UserCenterModel
        visible={center}
        onOk={() => setCenter(false)}
        onCancel={() => setCenter(false)}
      />
    </div>
  );
});
