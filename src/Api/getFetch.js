import request from './request.js';

function getFetch(api = {}, baseUrl) {
  Object.keys(api).forEach(item => {
    let data = api[item];
    if(typeof data === 'string') data = { url: data };
    data.url = `${baseUrl}${data.url}`
    const { url, method, useFormdata } = data;
    api[item] = params => request(url, params, useFormdata, method)
  })
  return api
}

export default getFetch;