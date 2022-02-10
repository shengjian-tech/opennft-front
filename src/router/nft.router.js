//产业大脑路由文件

import { preRouter } from '../commons/PRE_ROUTER'

//无需框架
export const nftRouterName=[
  `${preRouter}/login`,
  `${preRouter}/nft_home`,
  `${preRouter}/nft_detail`,
  `${preRouter}/nft_collection`,
  `${preRouter}/nft_myself`,
  `${preRouter}/nft_list`,
  `${preRouter}/nft_market`,
  `${preRouter}/nft_creatCollection`,
  `${preRouter}/nft_creatNFT`
]

//无需登录就可访问
export const nftRouterNoLogin=[
  `${preRouter}/login`,
]

export const nftRouter=[
  {
    path: `${preRouter}/nft_home`,
    component: () => import('../pages/Project/nft/pages/home'),
  },
  {
    path: `${preRouter}/nft_detail`,
    component: () => import('../pages/Project/nft/pages/detail'),
  },
  {
    path: `${preRouter}/nft_collection`,
    component: () => import('../pages/Project/nft/pages/collection'),
  },
  {
    path: `${preRouter}/nft_myself`,
    component: () => import('../pages/Project/nft/pages/myself'),
  },
  {
    path: `${preRouter}/nft_list`,
    component: () => import('../pages/Project/nft/pages/list'),
  },
  {
    path: `${preRouter}/nft_market`,
    component: () => import('../pages/Project/nft/pages/market'),
  },
  {
    path: `${preRouter}/nft_creatCollection`,
    component: () => import('../pages/Project/nft/pages/creatCollection'),
  },
  {
    path: `${preRouter}/nft_creatNFT`,
    component: () => import('../pages/Project/nft/pages/creatNFT'),
  },
]