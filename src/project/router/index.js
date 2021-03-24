import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui';
import login from './login'
import user from  './user.js'
import role from './role'
import manager from './manager'
import advice from './advice'

import version from './version'
import trendingWord from './trendingWord'
import slide from './slide'
import page from './page'
import notification from './notification'
import myInfo from './myInfo'
import clock from './clock'
import register from './register'

Vue.use(Router);
Vue.use(ElementUI);

let routeList = [
  login.routes,
  manager.routes,
  user.routes,
  role.routes,
  advice.routes,
  version.routes,
  trendingWord.routes,
  slide.routes,
  page.routes,
  notification.routes,
  myInfo.routes,
  clock.routes,
  register.routes
];

let routes = [];

//拼接路由
routeList.map(s => {
  routes = routes.concat(s);
});

const router = new Router({
  routes: routes
});

router.beforeEach((to,from,next) => {
  const loading = ElementUI.Loading.service({
    lock: true,
    text: '加载中',

    background: 'rgba(0, 0, 0, 0)'
  });
  /**
   * @Description: 拦截未登录
   * @author zd Lin
   * @date 2020/3/24
  */
  let user = localStorage.getItem('userCache');
  if (user) {
    next();
  } else {
    if (to.path === '/login' ||  to.path === '/'){
      next();
    }else if(to.path === '/register') {
      next();
    } 
    else {
      next({path:'/login'});
      loading.close()
    }

  }
  next();

});

router.afterEach(route => {
  const loading = ElementUI.Loading.service({
    lock: true,
    text: '加载中',
    background: 'rgba(0, 0, 0, 0)'
  });
  //将滚动条恢复到最顶端
  window.scrollTo(0, 0);
  setTimeout(() => {
     loading.close();
  },200);

});

export default router;
