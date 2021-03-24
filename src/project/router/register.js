const register = {
    routes: [
      {
        path: '/register',
        name: 'Register',
        meta:{
          breadcrumb:[
            {
              name:'注册界面',
              path:'/register'
            }
          ],
          isShowLeftSider:false,
          isShowHeader:false,
        },
        component: () => import('@/project/views/register.vue')
      },
    //   {
    //     path:'/login',
    //     name:'login',
    //     meta:{
    //       isShowHeader:true,
    //       isShowLeftSider:false,
    //     },
    //     component: () => import('@/project/views/Login.vue'),
    //   },
  
    ]
  }
  export default register;
  