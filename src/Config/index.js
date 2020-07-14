let baseUrl = window.location.origin;
if(baseUrl.indexOf('localhost') > -1 || baseUrl.indexOf('192.168') > -1) baseUrl = 'https://four.gicdev.com';

export const baseURL = baseUrl;
// 请求成功的code
export const succCode = '0000';
// 未登录、登录超时code
export const notAuthCode = '6666';