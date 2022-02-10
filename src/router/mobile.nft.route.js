//产业大脑路由文件

import { preRouter } from '../commons/PRE_ROUTER'

//无需框架
export const nftMobileRouterName=[
  // `${preRouter}/login`,
  `${preRouter}/nft_mobile_loading`,
  `${preRouter}/nft_mobile_home`,
  `${preRouter}/nft_mobile_list`,
  `${preRouter}/nft_mobile_search`,
  `${preRouter}/nft_mobile_create`,
  `${preRouter}/nft_mobile_myself`,
  `${preRouter}/nft_mobile_creatNft`,
  `${preRouter}/nft_mobile_creatCollection`,
  `${preRouter}/nft_mobile_collection`,
  `${preRouter}/nft_mobile_market`,
  `${preRouter}/nft_mobile_nftDetails`,
  `${preRouter}/nft_mobile_myself_collection`,
  `${preRouter}/nft_mobile_myself_created`,
  `${preRouter}/nft_mobile_myself_history`,
  `${preRouter}/nft_mobile_myself_myCollection`,
  `${preRouter}/nft_mobile_myself_focusOn`,
  `${preRouter}/nft_mobile_myself_info`,
  `${preRouter}/nft_mobile_myself_privacy`,
]

//无需登录就可访问
export const nftMobileRouterNoLogin=[
  // `${preRouter}/login`,
  `${preRouter}/nft_mobile_loading`,
]

export const nftMobileRouter=[
  // {
  //   path: `${preRouter}/login`,
  //   component: () => import('../pages/Project/mobile/nft-mobile/pages/login'),
  // },
  {
    path: `${preRouter}/nft_mobile_loading`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/loading'),
  },
  {
    path: `${preRouter}/nft_mobile_home`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/home'),
  },
  {
    path: `${preRouter}/nft_mobile_list`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/list'),
  },
  {
    path: `${preRouter}/nft_mobile_search`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/search'),
  },
  {
    path: `${preRouter}/nft_mobile_create`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/create'),
  },
  {
    path: `${preRouter}/nft_mobile_myself`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/myself'),
  },
  {
    path: `${preRouter}/nft_mobile_creatNft`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/creatNft'),
  },
  {
    path: `${preRouter}/nft_mobile_collection`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/collection'),
  },
  {
    path: `${preRouter}/nft_mobile_creatCollection`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/creatCollection'),
  },
  {
    path: `${preRouter}/nft_mobile_market`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/market'),
  },
  {
    path: `${preRouter}/nft_mobile_nftDetails`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/nftDetails'),
  },
  {
    path: `${preRouter}/nft_mobile_myself_collection`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/myself/components/collection'),
  },
  {
    path: `${preRouter}/nft_mobile_myself_created`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/myself/components/created'),
  },
  {
    path: `${preRouter}/nft_mobile_myself_history`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/myself/components/history'),
  },
  {
    path: `${preRouter}/nft_mobile_myself_myCollection`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/myself/components/myCollection'),
  },
  {
    path: `${preRouter}/nft_mobile_myself_focusOn`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/myself/components/focusOn'),
  },
  {
    path: `${preRouter}/nft_mobile_myself_info`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/myself/components/info'),
  },
  {
    path: `${preRouter}/nft_mobile_myself_privacy`,
    component: () => import('../pages/Project/mobile/nft-mobile/pages/myself/components/privacy'),
  },
]