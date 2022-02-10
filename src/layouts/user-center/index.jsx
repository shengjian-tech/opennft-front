/*
  个人中心
*/
import React, { Component } from 'react';
import config from 'src/commons/config-hoc';
import UserCenter from '../../pages/user-center/index';
import {ModalContent } from 'src/commons/ra-lib';
@config({
    ajax: true,
    loading: false,     // 页面加载loading
    modal: {
        title: '个人中心',
        fullScreen: true
    },
})


export default class TermsEnter extends Component {
    state = {
      
    };

    componentDidMount() {
       
    }


    render() {
        const {onOk,onCancel} = this.props;
        const { } = this.state;
        return (
          <ModalContent
              cancelText="关闭"
              okText="确定"
              onOk={() => { onOk() }}
              onCancel={() => { onCancel() }}
              surplusSpace='true'
          >
             <UserCenter/>
           </ModalContent>
        );
    }
}
