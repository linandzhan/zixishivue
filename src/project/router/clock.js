
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
      {
        path:'/clock/signInOut',
        name:'signInOut',
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
              name:'打卡操作',
              path:'/clock/signInOut'
            }
          ]
        },
        component: () => import('@/project/views/clock/signInOut')
      },
    ]
  }
  export default myInfo;