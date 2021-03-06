import request from './request';

function getFetch(api: any = {}, baseUrl: string, project: string) {
  Object.keys(api).forEach(item => {
    let data = api[item];
    if (typeof data === 'string') data = { url: data };
    data.url = `${baseUrl}${data.url}`;
    const { url, method, useFormData } = data;
    api[item] = (params: any) => request(url, params, useFormData, method, { project });
  });
  return api;
}

export default getFetch;
