let baseUrl = window.location.origin;
// 本地/局域网/自己服务器
if (baseUrl.indexOf('localhost') > -1 || baseUrl.indexOf('192.168') > -1 || baseUrl.indexOf('47.98') > -1) baseUrl = 'https://four.gicdev.com';

export const baseURL: string = baseUrl;
// 请求成功的code
export const succCode = '0000';
// 未登录、登录超时code
export const notAuthCode = '6666';
// 请求头数据
export const headConfig = {
  sign: '',
  route: ''
};
