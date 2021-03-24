import axios from '@/framework/http/axios'
// const model = 'advice';
// let getUrl = `api/${model}/get`;
// let searchUrl = `api/${model}/search`;
// let countUrl = `api/${model}/count`;
// let deleteUrl = `api/${model}/delete`;
// let batchDeleteUrl = `api/${model}/delete`;
// let enableUrl = `api/${model}/enable`;
// let disableUrl = `api/${model}/disable`;

export function getAccount(param, callback) {
  axios.post(`/account/getAccount`, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}