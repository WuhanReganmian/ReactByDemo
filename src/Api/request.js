import axios from 'axios';
import { message } from 'antd';
import qs from 'qs';
import { baseURL, succCode, notAuthCode} from '@/Config';

// 请求方法
export const AXIOS_METHOD_TYPET = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};
/** 方法说明
 * @method request
 * @param api 请求相对地址
 * @param params 请求参数 默认为空
 * @param isFormdata 是否使用formdata 默认为false
 * @param method 请求方法，默认get
 * @param config 请求配置 默认为空
 * @return function 返回axios实例
*/
const request = (api, params = {}, isFormdata = false,  method = AXIOS_METHOD_TYPET.GET, config = {}) => {
    method = method.toLocaleUpperCase();
    // get请求放在params中，其他请求放在body
    const data = method === 'GET' ? 'params' : 'data';
    // formdata转换
    if(isFormdata) params = qs.stringify(params);
    // 这部分也可以放到defaults中去设置
    let headers = {
        // 'X-Requested-With': 'XMLHttpRequest',
        // 'Content-Type': 'application/json'
        isControl: true
    };
    if (config.headers) {
        headers = {
          ...headers,
          ...config.headers
        };
    }
    return axios({
        baseURL,
        url: api,
        method,
        [data]: params,
        headers,
        withCredentials: true,
    });
};
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return new Promise((resolve, reject) => {
    let data = response.data;
    const { code, message: msg } = data;
    if(code === notAuthCode) {
      // window.location.href = `${window.location.origin}/#/login`;
      window.location.href = '/login';
      return;
    } else if(code !== succCode) {
      message.error(msg)
      return reject(data);
    }
    resolve(data);
  })
}, function (error) {
  // 对响应错误做点什么
  let res = error.response || {};
  let data = res.data || {};
  message.error(data.message);
  return Promise.reject(data);
});
export default request;