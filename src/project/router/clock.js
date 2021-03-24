
  const myInfo = {
    routes: [
      {
        path:'/clock/list',
        name:'clock',
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
              name:'打卡记录',
              path:'/clock/list'
            }
          ]
        },
        component: () => import('@/project/views/clock/list')
      },
    ]
  }
  export default myInfo;