
  const myInfo = {
    routes: [
      {
        path:'/myInfo/myInfoList',
        name:'myInfo',
        meta:{
          isShowHeader:true,
          isShowLeftSider:true,
          keepAlive:true,
          breadcrumb: [
            {
              name:'首页',
              path:'/index'
            },
            {
              name:'我的信息',
              path:'/myInfo/myInfoList'
            }
          ]
        },
        component: () => import('@/project/views/myInfo/myInfoList')
      },
    ]
  }
  export default myInfo;