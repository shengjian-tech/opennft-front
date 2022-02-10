import pageRoutes, { noAuths, noFrames, keepAlives } from './app.routes';
import { PageLoading } from 'src/commons/ra-lib';
import loadable from '@loadable/component';
import React from 'react';
import { preRouter } from 'src/commons/PRE_ROUTER'

// 不需要页面框架的页面配置
export const noFrameRoutes = noFrames;

// 不需要登录的页面
export const noAuthRoutes = noAuths;

// 需要keep alive 页面
export const keepAliveRoutes = keepAlives;

// 所有人都可以访问的页面
export const ommonPaths = [
    `${preRouter}`,
    `${preRouter}/login`,
];

export default [
    // 默认打开地址
    {path: '/', component:`${preRouter}/`},
].concat(pageRoutes)
    .map(item => {
        return {
            path: item.path,
            component: loadable(item.component, { fallback: <PageLoading/> }),
        };
    });
