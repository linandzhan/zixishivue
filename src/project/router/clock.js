
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
              name:'套餐管理',
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
          isShowHeader:false,
          isShowLeftSider:false,
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