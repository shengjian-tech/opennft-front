import React, { Component } from 'react';
import { Tree, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import './style.less'

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
  ajax: true,
})
export default class TreeDepartment extends Component {
  state = {
    loading: false,
    data: [],
    treeId: '',
    treeName: ''
  }
  componentDidMount() {
    this.handleDepartment();
  }
  handleDepartment = () => {
    const departmentUrl = `${CODEMAP.t_find_user_org_tree}`;
    this.props.ajax.post(departmentUrl).then(res => {
      if (res.statusCode == '200' && res.status == 'success') {
        this.setState({ data: res.result })
      } else {
        message.error(res.message);
      }
    })
  }
  onSelect = (selectedKeys, e) => {
    this.setState({
      treeId: e.node.key,
      treeName: e.node.title
    }, () => {
      this.props.handleTreeInfo(this.state)
    })
  }
  render() {
    const { data } = this.state
    return (
      <Tree
        styleName="antTree"
        onSelect={this.onSelect}
        treeData={data}
        defaultExpandAll={true}
        switcherIcon={<PlusOutlined />}
      />
    );
  }
}