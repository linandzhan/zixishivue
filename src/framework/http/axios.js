import axios from 'axios';
import store from '@/framework/store';
import { Notification } from 'element-ui';
import router from '@/project/router';
// create axios instance
let instance = null;

if (process.env.NODE_ENV === 'development') {
  instance = axios.create({
    baseURL: '/' // api context
  });
} else {
  // 生产环境下
  instance = axios.create({
    baseURL: '/' // api context
  });
}

instance.defaults.timeout = 50000; // timeout


// request interceptors
instance.interceptors.request.use(
  // request => {
  //   return request;
  // },
  config => {
    if(window.localStorage) {
      let ls = window.localStorage;
      let userStr = ls.getItem("userCache");
      if(userStr) {
        let user = JSON.parse(userStr);
        if (user.token) {
          config.headers['authorization'] = user.token;
        }
      }
 
    }

    // console.log(user);
    // console.log(store.state.user.token)
    // if token exist, add Access-Token to request header
// else {
//       // let result = store.dispatch("GET_USER_EXIST");
//       // result.then((flag) => {
//       //   if (flag) {
//       //     store.dispatch("GET_USER_CACHE");
//       //     if (store.state.user.token) {
//       //       config.headers['authorization'] = store.state.user.token;
//       //       config.headers['id'] = store.state.user.id;
//       //     }
//       //   }
//       // })
//     }
    // change data to formData
    // let keys = Object.keys(config.data);
    // let formData = new FormData();
    // for (let i = 0, len = keys.length; i < len; i++) {
    //   let key = keys[i];
    //   formData.append(key, config.data[key]);
    // }
    // config.data = formData;
    return config;
  },
  error => {
    // Do something with request error
    console.log("request", error);
    Notification({
      title: '错误',
      message: '这是一条错误的提示消息',
      type: 'error'
    });
    Promise.reject(error);
  },
);

// response interceptors response data format {code: 200, data: {}} or {code: 400, message: "error"}
instance.interceptors.response.use(
  response => {
    console.log(response);
    let res = response.data;
    let code = res.code;
    if (code) {
      if (code === 200) {
        console.log('登录成功啦')
        let data = res.data;
        if (data === undefined || data === '' || data === null) {
          data = 0
        }
        return data
      } else if (code === 401) {
        // handle token is expired
        router.push("/login")
      } else {
        // handle code is not 200
        Notification({
          title: '警告',
          message: `${res.message}`,
          type: 'warning'
        })
      }
    }
  },
);

export default instance;
