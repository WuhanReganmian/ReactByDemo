import axios from 'axios';
import { message } from 'antd';
import qs from 'qs';
import { baseURL, succCode, notAuthCode } from 'src/Config';
import { headConfig } from 'src/Components/layout';

// 请求方法
export const AXIOS_METHOD_TYPET = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};
/* 方法说明
 * @method request
 * @param api 请求相对地址
 * @param params 请求参数 默认为空
 * @param isFormdata 是否使用formdata 默认为false
 * @param method 请求方法，默认get
 * @param config 请求配置 默认为空
 * @return function 返回axios实例
 */
const request = async (api: string, params: any = {}, isFormdata = false,  method = AXIOS_METHOD_TYPET.GET, config: any) => {
  method = method.toLocaleUpperCase();
  // get请求放在params中，其他请求放在body
  const data = method === 'GET' ? 'params' : 'data';
  // formdata转换
  if (isFormdata) params = qs.stringify(params);
  // 配置请求头
  let headers = {
    isControl: true,
    ...headConfig,
    ...config
  };
  return axios({
    method: method as 'GET' | 'POST',
    baseURL,
    url: api,
    [data]: params,
    headers,
    withCredentials: true
  });
};
// 添加请求拦截器
axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  return config;
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(response => {
  // 对响应数据做点什么
  return new Promise((resolve, reject) => {
    let data = response.data;
    const { code, message: msg } = data;
    if (code === notAuthCode) {
      const { origin, pathname } = window.location;
      window.location.href = `${origin}${pathname}#/login`;
      return;
    } else if (code !== succCode) {
      message.error(msg);
      return reject(data);
    }
    resolve(data);
  });
}, error => {
  let res = error.response || {};
  let data = res.data || {};
  if (data.code === notAuthCode) {
    const { origin, pathname } = window.location;
    window.location.href = `${origin}${pathname}#/login`;
    return;
  }
  message.error(data.message || '网络连接中断');
  return Promise.reject(data);
});

export default request;
