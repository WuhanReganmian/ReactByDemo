import request from './request.js';

function getFetch(api = {}, baseUrl) {
  Object.keys(api).forEach(item => {
    let data = api[item];
    if(typeof data === 'string') data = { url: data };
    data.url = `${baseUrl}${data.url}`
    const { url, method, useFormData } = data;
    api[item] = params => request(url, params, useFormData, method)
  })
  return api
}

export default getFetch;