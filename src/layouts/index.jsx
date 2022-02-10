import React from 'react';
import config from 'src/commons/config-hoc';
import { Layout, HeaderSetting } from 'src/commons/ra-lib';
import HeaderUser from './header-user';
import logo from '../assets/logo.png';

import './style.less';

//如果需要打开菜单位置控制和全屏控制，请把下面注释全部放开。

//import cfg from 'src/config';
// const {isDev} = cfg;
//import {FullScreen, HeaderSetting, isMobile} from 'src/commons/ra-lib';

export default config({
    connect: state => ({ layoutState: state.layout }),
})(function LayoutFrame(props) {
    const { action, layoutState } = props
    return (
        <Layout
            {...props}
            logo={logo}
            headerRight={
                <>
                    {/* <HeaderSetting layoutState={layoutState} action={action} /> */}
                    {/* {isDev ? (<div styleName="action"><FullScreen/></div>) : null}
                    {isMobile ? null : (
                        <>
                            <HeaderSetting layoutState={layoutState} action={action}/>
                        </>
                    )} */}
                    <HeaderUser />
                </>
            }
        />
    );
});
