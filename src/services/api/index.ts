import ApiResp = App.ApiResp;

const server: string = 'http://127.0.0.1:8080'
// const server: string = 'https://mp.guanshantech.com'

interface Option {
  method: 'GET' | 'POST',
  url: string,
  data?: any | undefined,
}

// 封装wx.request 为promise对象，方便同步调用，切面处理
const request = (optain: {}): Promise<ApiResp<any>> => {
  const token = wx.getStorageSync('token') || ''
  const header: any = {
    'content-type': 'application/json',
    'Authorization': `Bearer ${token}` // 假设你使用Bearer token认证
  };

  return new Promise((resolve, reject) => {
    wx.request({
      ...optain,
      header,
      success: (res: any) => {
        resolve(res.data)
      },
      fail: (err: any) => {
        reject(err)
      },
    })
  })
}

// 切面处理
const wx_request = async (option: Option): Promise<any> => {
  console.log("api request", option)
  const resp = await request(option)
  console.log('api response', resp)

  // 统一错误显示
  if (resp.success) {
    wx.showToast({
      icon: 'none',
      title: resp.errorMsg,
      duration: 2000,
    });
  }

  return resp.data;
}

const wx_get = (api: string): Promise<any> => {
  const option: Option = {
    method: 'GET',
    url: server + api,
  }
  return wx_request(option)
}

const wx_post = (api: string, data: any): Promise<any> => {
  const option: Option = {
    method: 'POST',
    url: server + api,
    data,
  }

  return wx_request(option)
}

export default {
  wx_get,
  wx_post,
}