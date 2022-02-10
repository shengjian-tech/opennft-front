import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, tree, Table } from 'src/commons/ra-lib';
import config from 'src/commons/config-hoc';
// import getMenus from 'src/menus';
import './style.less';
const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

@config({
  ajax: true,
})
export default class index extends Component {
  static propTypes = {
    value: PropTypes.array,     // 选中的节点
    onChange: PropTypes.func,   // 选择节点时，触发
  };

  state = {
    loading: false,
    menus: [],
    allMenuKeys: [],
    expandedRowKeys: [],
  };

  columns = [
    {
      title: '名称', dataIndex: 'text', key: 'text',
      render: (value, record) => {
        const { icon } = record;

        if (icon) return <span><Icon type={icon} /> {value}</span>;

        return value;
      },
    },
    {
      title: '类型', dataIndex: 'type', key: 'type', width: 100,
      render: (value, record) => {
        const { url } = record;
        if (url) return <span style={{ color: 'purple' }}>外站</span>;
        if (value === 1) return <span style={{ color: 'green' }}>导航菜单</span>;
        if (value === 0) return <span style={{ color: 'orange' }}>功能按钮</span>;

        // return <span style={{ color: 'green' }}>菜单</span>;
      },
    },
  ];

  componentDidMount() {
    this.handleSearch();
  }

  handleSearch() {
    this.setState({ loading: true });
    this.props.ajax
      .post(`${CODEMAP.t_role_menu_data}`)
      // getMenus()
      .then(res => {
        const menus = res.result.map(item => ({ key: item.key, parentKey: item.parentKey, ...item }));
        const menusList = function (list) {
          list.forEach((row) => {
            if (row.children) {
              row.key = row.key
              menusList(row.children)
            } else {
              row.key = row.key
            }
          });
        }
        menusList(res.result)
        // 菜单根据sortno 排序
        const orderedData = [...menus].sort((a, b) => {
          const aOrder = a.sortno || 0;
          const bOrder = b.sortno || 0;

          // 如果sortno都不存在，根据 text 排序
          // if (!aOrder && !bOrder) {
          //     return a.text > b.text ? 1 : -1;
          // }
          return bOrder - aOrder;
        });

        const menuTreeData = tree.convertToTree(orderedData);
        this.setState({ menus: menuTreeData });
      })
      .finally(() => this.setState({ loading: false }));
  }


  handleSelect = (record, selected, selectedRows, nativeEvent) => {
    const { value = [] } = this.props;
    const { menus } = this.state;
    console.log(menus)

    const { key } = record;
    let allKeys = [...value];
    // 全选 取消 子级
    console.log(menus)
    const childrenKeys = tree.getGenerationKeys(menus, key);
    console.log(selected)
    console.log(childrenKeys)
    const { parentKeys = [] } = record;

    if (selected) {
      // 子级全部加入
      allKeys = allKeys.concat(key, ...childrenKeys);
      // 父级状态 全部加入
      allKeys = allKeys.concat(...parentKeys);
    } else {
      // 子级全部删除
      console.log(allKeys);
      allKeys = allKeys.filter(item => !(([key, ...childrenKeys]).includes(item)));
      console.log(allKeys);

      // 判断父级状态 只要有后代选中就加入
      parentKeys.reverse().forEach(pk => {
        const cKs = tree.getGenerationKeys(menus, pk);
        console.log(cKs)
        const hasChildSelected = cKs.some(ck => allKeys.includes(ck));

        if (hasChildSelected) {
          allKeys.push(pk);
        } else {
          allKeys = allKeys.filter(item => item !== pk);
        }
      });
    }

    const { onChange } = this.props;

    onChange && onChange(Array.from(new Set(allKeys)));
  };

  handleSelectAll = (selected) => {
    const { allMenuKeys } = this.state;
    const { onChange } = this.props;

    onChange && onChange(selected ? allMenuKeys : []);
  };

  render() {
    const {
      menus,
      loading,
      expandedRowKeys,
    } = this.state;

    const { value, onChange, ...others } = this.props;

    return (
      <Table
        expandable={{
          expandedRowKeys: expandedRowKeys,
          onExpandedRowsChange: expandedRowKeys => this.setState({ expandedRowKeys }),
        }}
        rowSelection={{
          selectedRowKeys: value,
          onSelect: this.handleSelect,
          onSelectAll: this.handleSelectAll,
          hideSelectAll: true,
          // checkStrictly:false
        }}
        loading={loading}
        columns={this.columns}
        dataSource={menus}
        pagination={false}  
        rowKey="key"
        {...others}
        
      />
    );
  }
}

