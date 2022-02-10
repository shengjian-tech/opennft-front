import React, { useEffect, useState, useRef } from 'react';
import config from 'src/commons/config-hoc';
import ReactEcharts from 'echarts-for-react';

const localStorage = window.localStorage;
const CODEMAP = JSON.parse(localStorage.getItem('login-user')).codeMap;

export default config({
  ajax: true,
  connect: state => ({ layoutState: state.layout }),//获取当前选中

})((props) => {
  // 数据定义
  const [data, setData] = useState([])
  let interval = useRef(null)

  // 请求相关定义 只是定义，不会触发请求，调用相关函数，才会触发请求
  const [loading, fetchUsers] = props.ajax.usePost(`${CODEMAP.t_cre_home_trading}`);

  //页面默认图表数据
  //交易数
  async function handleSearch() {
    if (loading) return;
    const res = await fetchUsers();
    if (res.result) {
      
    }
  }
  function getOptions() {
    const option = {
      xAxis: {
        type: 'category',
        data: ['5/20', '5/20', '5/20', '5/20', '5/20', '5/20', '5/20']
      },
      yAxis: {
        type: 'value'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          symbol: "none",
        }
      ]
    };
    return option;
  };
  // 组件初始化完成之后，进行一次查询  初始化搜索。
  useEffect(() => {
    (async () => {
      // await handleSearch()
      //每两秒刷新数据
      // interval.current = setInterval(() => {
      //   handleSearch()
      // }, 3000)
      
    })();
    //离开页面清除定时器
    // return () => clearInterval(interval.current)
  }, []);

  return (
    <div id='chartContainer'>
      <ReactEcharts
        id='main'
        option={getOptions()}
        style={{height:'260px'}}
      />
    </div>
  );
});