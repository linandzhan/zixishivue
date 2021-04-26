
const notification = {
  routes: [
    {
      path:'/notification/list',
      name:'notificationList',
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
            name:'我的预约',
            path:'/notification/list'
          }
        ]
      },
      component: () => import('@/project/views/notification/list')
    },
    {
      path:'/notification/show/:id',
      meta:{
        isShowHeader:true,
        isShowLeftSider:true,
        breadcrumb: [
          {
            name:'首页',
            path:'/index'
          },
          {
            name:'收支统计',
            path:'/notification/list'
          },
          {
            name:'广告管理详情',
            path:'/notification/show/:id'
          }
        ]
      },
      component: () => import('@/project/views/notification/show')
    },

  ]
}
export default notification;
